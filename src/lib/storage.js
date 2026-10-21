import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from './supabase';
import { formatBytes, getFileCategory, getFileTypeBadge } from '../utils/formatters';

// Maximum upload file size: 50MB (standard for personal cloud storage)
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// Helper to provide clear error messages for Supabase storage errors
export function formatStorageError(error) {
  if (!error) return 'An unknown error occurred';
  const msg = error.message || String(error);

  if (msg.toLowerCase().includes('bucket not found') || msg.toLowerCase().includes('not found')) {
    return `Storage bucket '${STORAGE_BUCKET}' not found in your Supabase project. Please create a private bucket named '${STORAGE_BUCKET}'.`;
  }
  if (msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('policy') || msg.toLowerCase().includes('access denied')) {
    return 'Permission denied by Supabase Row Level Security. Ensure your storage policies for "primefiles-storage" are applied.';
  }
  if (msg.toLowerCase().includes('jwt') || msg.toLowerCase().includes('token')) {
    return 'Your session has expired. Please log out and sign in again.';
  }

  return msg;
}

/**
 * Upload a file for the current authenticated user.
 * Pattern: userId/uniqueId/originalFilename
 */
export async function uploadUserFile(userId, file) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please check your .env file.');
  }

  if (!userId) {
    throw new Error('User authentication is required to upload files.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File is too large. Maximum allowed size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`);
  }

  // Generate unique ID for collision avoidance
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const cleanOriginalName = file.name.replace(/[/\\]/g, '_');
  const storagePath = `${userId}/${uniqueId}/${cleanOriginalName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });

  if (error) {
    throw new Error(formatStorageError(error));
  }

  return {
    id: `${uniqueId}-${cleanOriginalName}`,
    name: cleanOriginalName,
    fullPath: storagePath,
    uniqueId,
    sizeBytes: file.size,
    sizeFormatted: formatBytes(file.size),
    type: getFileTypeBadge(cleanOriginalName).toLowerCase(),
    category: getFileCategory(cleanOriginalName),
    uploadedAt: new Date().toISOString(),
    uploadedDateFormatted: 'Just now',
    device: 'Web Client',
  };
}

/**
 * Fetch and list all files belonging exclusively to the current user.
 * Reads the user's directory: userId/
 */
export async function listUserFiles(userId) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  if (!userId) {
    return [];
  }

  // Step 1: List items in the user's root folder (userId/)
  const { data: topLevelItems, error: topError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(userId, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (topError) {
    throw new Error(formatStorageError(topError));
  }

  if (!topLevelItems || topLevelItems.length === 0) {
    return [];
  }

  const filePromises = topLevelItems
    .filter((item) => item.name !== '.emptyFolderPlaceholder')
    .map(async (item) => {
      // If item has no id or metadata, it's a subfolder (uniqueId)
      if (!item.id || item.id === null) {
        const uniqueId = item.name;
        const { data: innerFiles, error: innerError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(`${userId}/${uniqueId}`, {
            limit: 20,
          });

        if (innerError || !innerFiles) return [];

        return innerFiles
          .filter((f) => f.name !== '.emptyFolderPlaceholder')
          .map((f) => {
            const size = f.metadata?.size ?? 0;
            const created = f.created_at || f.updated_at || item.created_at || new Date().toISOString();
            const dateObj = new Date(created);
            const formattedDate = !isNaN(dateObj)
              ? dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return {
              id: `${uniqueId}-${f.name}`,
              name: f.name,
              fullPath: `${userId}/${uniqueId}/${f.name}`,
              uniqueId,
              sizeBytes: size,
              sizeFormatted: formatBytes(size),
              type: getFileTypeBadge(f.name).toLowerCase(),
              category: getFileCategory(f.name),
              uploadedAt: created,
              uploadedDateFormatted: formattedDate,
              device: 'Cloud Storage',
            };
          });
      }

      // Flat file under userId/ (if any exists)
      const size = item.metadata?.size ?? 0;
      const created = item.created_at || item.updated_at || new Date().toISOString();
      const dateObj = new Date(created);
      const formattedDate = !isNaN(dateObj)
        ? dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Recent';

      return [
        {
          id: `root-${item.name}`,
          name: item.name,
          fullPath: `${userId}/${item.name}`,
          uniqueId: 'root',
          sizeBytes: size,
          sizeFormatted: formatBytes(size),
          type: getFileTypeBadge(item.name).toLowerCase(),
          category: getFileCategory(item.name),
          uploadedAt: created,
          uploadedDateFormatted: formattedDate,
          device: 'Cloud Storage',
        },
      ];
    });

  const nestedResults = await Promise.all(filePromises);
  const flattened = nestedResults.flat();

  // Sort newest first
  return flattened.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

/**
 * Securely download an original file using an authenticated stream.
 * Does not expose public URLs.
 */
export async function downloadUserFile(fullPath, originalFilename) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  // 1. Download authenticated blob directly from private storage
  const { data: blob, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(fullPath);

  if (error) {
    throw new Error(formatStorageError(error));
  }

  if (!blob) {
    throw new Error('Received empty file data.');
  }

  // 2. Trigger browser download preserving original filename
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = originalFilename || 'download';
  document.body.appendChild(link);
  link.click();

  // Cleanup object URL
  setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
    document.body.removeChild(link);
  }, 100);

  return true;
}

/**
 * Remove a file from Supabase private storage.
 */
export async function deleteUserFile(fullPath) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fullPath]);

  if (error) {
    throw new Error(formatStorageError(error));
  }

  return true;
}
