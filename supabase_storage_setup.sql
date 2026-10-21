-- =========================================================================
-- PrimeFiles — Supabase Storage Bucket & Row Level Security (RLS) Setup
-- =========================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor
-- This ensures the 'primefiles-storage' bucket is PRIVATE and each user
-- can ONLY upload, list, download, and delete files inside their own userId folder.
-- Path pattern: auth.uid()/uniqueId/originalFilename
-- =========================================================================

-- 1. Create the private bucket 'primefiles-storage' if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'primefiles-storage',
  'primefiles-storage',
  false, -- STRICTLY PRIVATE BUCKET
  52428800, -- 50 MB file size limit in bytes
  NULL -- Allow all standard document, code, archive, and media types
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies for primefiles-storage if any to prevent conflicts
DROP POLICY IF EXISTS "PrimeFiles: Users can upload to own directory" ON storage.objects;
DROP POLICY IF EXISTS "PrimeFiles: Users can view and download own files" ON storage.objects;
DROP POLICY IF EXISTS "PrimeFiles: Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "PrimeFiles: Users can update own files" ON storage.objects;

-- 4. INSERT Policy (Upload)
-- A user can ONLY upload objects into 'primefiles-storage' if the first path segment equals their auth.uid()
CREATE POLICY "PrimeFiles: Users can upload to own directory"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 5. SELECT Policy (List & Download)
-- A user can ONLY view and download objects from 'primefiles-storage' if the first path segment equals their auth.uid()
CREATE POLICY "PrimeFiles: Users can view and download own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 6. DELETE Policy (Delete)
-- A user can ONLY delete objects from 'primefiles-storage' if the first path segment equals their auth.uid()
CREATE POLICY "PrimeFiles: Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 7. UPDATE Policy (Optional overwrite/metadata update)
CREATE POLICY "PrimeFiles: Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);
