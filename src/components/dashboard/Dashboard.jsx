import React, { useState, useEffect, useCallback } from 'react';
import { Upload, RefreshCw, Database, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../common/Navbar';
import StorageStats from './StorageStats';
import FileFilters from './FileFilters';
import FileList from './FileList';
import UploadModal from './UploadModal';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import ConfirmDialog from '../common/ConfirmDialog';
import Toast from '../common/Toast';
import { useAuth } from '../../context/useAuth';
import { listUserFiles, uploadUserFile, downloadUserFile, deleteUserFile, formatStorageError } from '../../lib/storage';
import { STORAGE_BUCKET } from '../../lib/supabase';
import { INITIAL_FILES } from '../../data/mockFiles';

export default function Dashboard() {
  const { user, isSupabaseConfigured, isDemoUser } = useAuth();

  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  // Storage loading & error states
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [storageError, setStorageError] = useState(null);
  const [showBucketSetupGuide, setShowBucketSetupGuide] = useState(false);

  // Operations in-flight
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals & Notifications
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, title = '', type = 'info') => {
    setToast({ message, title, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch current user's files from Supabase Storage
  const loadFiles = useCallback(async () => {
    if (!user) return;
    setIsLoadingFiles(true);
    setStorageError(null);

    // If demo mode (no Supabase config), load initial mock files
    if (isDemoUser || !isSupabaseConfigured) {
      setFiles(INITIAL_FILES);
      setIsLoadingFiles(false);
      return;
    }

    try {
      const userFiles = await listUserFiles(user.id);
      setFiles(userFiles);
    } catch (err) {
      console.error('Error fetching user files:', err);
      const formatted = formatStorageError(err);
      setStorageError(formatted);
      if (formatted.toLowerCase().includes('bucket') || formatted.toLowerCase().includes('policy')) {
        setShowBucketSetupGuide(true);
      }
    } finally {
      setIsLoadingFiles(false);
    }
  }, [user, isSupabaseConfigured, isDemoUser]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!user) return;
      setIsLoadingFiles(true);
      setStorageError(null);

      if (isDemoUser || !isSupabaseConfigured) {
        if (isMounted) {
          setFiles(INITIAL_FILES);
          setIsLoadingFiles(false);
        }
        return;
      }

      try {
        const userFiles = await listUserFiles(user.id);
        if (isMounted) {
          setFiles(userFiles);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching user files:', err);
          const formatted = formatStorageError(err);
          setStorageError(formatted);
          if (formatted.toLowerCase().includes('bucket') || formatted.toLowerCase().includes('policy')) {
            setShowBucketSetupGuide(true);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingFiles(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [user, isSupabaseConfigured, isDemoUser]);

  // Upload handler
  const handleUploadFile = async (file, device) => {
    if (!user) return;
    setIsUploading(true);

    try {
      if (isDemoUser || !isSupabaseConfigured) {
        const mockNew = {
          id: `file-${Date.now()}`,
          name: file.name,
          fullPath: `demo/${Date.now()}/${file.name}`,
          sizeBytes: file.size,
          sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.split('.').pop().toLowerCase(),
          category: 'documents',
          uploadedAt: new Date().toISOString(),
          uploadedDateFormatted: 'Just now',
          device: device || 'Laptop',
        };
        setFiles((prev) => [mockNew, ...prev]);
        showToast(`"${file.name}" uploaded to demo storage.`, 'Upload Complete', 'success');
        return;
      }

      const uploadedMeta = await uploadUserFile(user.id, file);
      uploadedMeta.device = device || 'Web Client';

      // Refresh list to maintain consistency with Supabase
      await loadFiles();
      showToast(`"${file.name}" uploaded securely to your private cloud storage!`, 'Upload Successful', 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      const msg = formatStorageError(err);
      showToast(msg, 'Upload Failed', 'error');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Download handler
  const handleDownload = async (file) => {
    setDownloadingId(file.id);

    try {
      if (isDemoUser || !isSupabaseConfigured) {
        showToast(`"${file.name}" downloaded in preview mode.`, 'Download Started', 'info');
        return;
      }

      await downloadUserFile(file.fullPath, file.name);
      showToast(`"${file.name}" downloaded successfully.`, 'Download Complete', 'success');
    } catch (err) {
      console.error('Download failed:', err);
      const msg = formatStorageError(err);
      showToast(msg, 'Download Failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  // Delete prompt & execution
  const handleDeletePrompt = (file) => {
    setFileToDelete(file);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      if (isDemoUser || !isSupabaseConfigured) {
        setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
        showToast(`"${fileToDelete.name}" removed from view.`, 'File Deleted', 'success');
        setFileToDelete(null);
        return;
      }

      await deleteUserFile(fileToDelete.fullPath);
      await loadFiles();
      showToast(`"${fileToDelete.name}" deleted from your cloud storage.`, 'File Deleted', 'success');
      setFileToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
      const msg = formatStorageError(err);
      showToast(msg, 'Delete Failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter files based on search input and category
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      file.category === selectedCategory ||
      file.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userEmail = user?.email || 'user@primefiles.local';
  const displayName = user?.user_metadata?.full_name || userEmail.split('@')[0];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onUploadClick={() => setIsUploadOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* User Greeting & Tagline Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Welcome,</span>
              <span className="text-blue-400 truncate max-w-xs sm:max-w-md">{displayName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Logged in as <span className="font-mono text-slate-300 font-medium">{userEmail}</span> • <span className="text-blue-400 font-medium">Your files, everywhere.</span>
            </p>
          </div>
        </div>

        {/* Storage bucket setup notice if missing */}
        {storageError && showBucketSetupGuide && (
          <div className="mb-6 bg-amber-950/40 border border-amber-600/40 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-200">Supabase Storage Setup Required</h3>
                  <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                    The private storage bucket <code className="bg-amber-900/60 px-1.5 py-0.5 rounded font-mono text-amber-100">primefiles-storage</code> was not found or lacks Row Level Security policies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBucketSetupGuide(!showBucketSetupGuide)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                {showBucketSetupGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showBucketSetupGuide ? 'Hide Instructions' : 'View Instructions'}</span>
              </button>
            </div>

            {showBucketSetupGuide && (
              <div className="mt-4 pt-3 border-t border-amber-700/30 text-xs text-amber-200/90 space-y-2.5">
                <p className="font-semibold text-amber-100">Follow these 2 quick steps in your Supabase Dashboard:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-amber-300/90">
                  <li>Go to <strong>Storage</strong> ➔ <strong>New Bucket</strong> ➔ Name it <strong className="text-white font-mono">{STORAGE_BUCKET}</strong>. Leave it <strong>Private</strong>.</li>
                  <li>Go to <strong>SQL Editor</strong> and run the provided Row Level Security policy script to allow users access to their own <code className="font-mono text-white">userId/</code> folder.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Storage Stats Cards */}
        <StorageStats 
          files={files} 
          onUploadClick={() => setIsUploadOpen(true)} 
        />

        {/* Section Header: My Files & Search */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 mb-6 shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  My Files
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-blue-400 border border-slate-700">
                  {files.length} {files.length === 1 ? 'file' : 'files'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your secure personal documents and media synced across phone, laptop, and college PC.
              </p>
            </div>

            {/* Actions: Primary Upload Button & Refresh */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={loadFiles}
                disabled={isLoadingFiles}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh file list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin text-blue-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="pt-4">
            <FileFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

        </div>

        {/* Content Section: Loading, Error, or Files */}
        {isLoadingFiles ? (
          <LoadingState />
        ) : storageError && files.length === 0 ? (
          <ErrorState error={storageError} onRetry={loadFiles} />
        ) : (
          <FileList
            files={filteredFiles}
            viewMode={viewMode}
            onDownload={handleDownload}
            onDelete={handleDeletePrompt}
            downloadingId={downloadingId}
            isFiltered={filteredFiles.length === 0 && (searchQuery.length > 0 || selectedCategory !== 'all')}
            searchQuery={searchQuery}
            onResetSearch={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            onUploadClick={() => setIsUploadOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 PrimeFiles • Your files, everywhere.</p>
          <div className="flex items-center gap-3">
            <span>Encrypted Cloud Storage</span>
            <span>•</span>
            <span>Private Cloud Vault</span>
          </div>
        </div>
      </footer>

      {/* Real Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadFile={handleUploadFile}
        isUploading={isUploading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!fileToDelete}
        title="Delete File from PrimeFiles"
        message={`Are you sure you want to permanently delete "${fileToDelete?.name}"? It will be removed from your private cloud storage.`}
        confirmText="Delete File"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setFileToDelete(null)}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
