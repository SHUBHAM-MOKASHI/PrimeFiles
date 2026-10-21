# PrimeFiles — Your files, everywhere. ☁️

**PrimeFiles** is a clean, secure, and modern personal cloud-storage website. Upload files from your phone or laptop and later log in from any device — including your college computer — to download them securely.

---

## 🎨 Branding & Theme

- **Name:** PrimeFiles
- **Tagline:** *Your files, everywhere.*
- **Theme:** Modern dark navy and blue styling with high-contrast typography and subtle borders.
- **Responsiveness:** Full multi-device support (mobile phone, tablet, and desktop).

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **@supabase/supabase-js** (Official client for authentication and private storage)
- **Tailwind CSS v4**
- **Lucide React** (Clean icons)

---

## 🚀 Supabase Setup Guide (One-Time Setup)

### Step 1: Environment Variables
Create or verify your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

> **Note:**
> - Never place your `service_role` secret key in frontend code.
> - Restart `npm run dev` after making changes to `.env`.

### Step 2: Storage Bucket & RLS Policies (1-Click SQL)
In your Supabase project dashboard:
1. Go to the **SQL Editor** tab in the left sidebar.
2. Click **New Query**.
3. Copy and paste the contents of [`supabase_storage_setup.sql`](./supabase_storage_setup.sql) (or run the script below):

```sql
-- 1. Create the private bucket 'primefiles-storage'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'primefiles-storage',
  'primefiles-storage',
  false, -- STRICTLY PRIVATE BUCKET
  52428800, -- 50 MB file size limit in bytes
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. INSERT Policy (Upload): Users can ONLY upload into their own userId folder
CREATE POLICY "PrimeFiles: Users can upload to own directory"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 4. SELECT Policy (List & Download): Users can ONLY view/download their own files
CREATE POLICY "PrimeFiles: Users can view and download own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 5. DELETE Policy (Delete): Users can ONLY delete their own files
CREATE POLICY "PrimeFiles: Users can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'primefiles-storage'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);
```
4. Click **Run**.
*(This creates the private `primefiles-storage` bucket and enforces complete Row Level Security so each user has their own private storage space isolated by user ID).*

### Step 3: Instant Multi-User Signups & Avoiding Email Rate Limits (Recommended)
By default, Supabase has "Confirm email" turned on, and limits built-in confirmation emails to only 3-4 per hour on the free tier. When creating a second account, you may see `Email rate limit exceeded` or delays.

To allow multiple accounts to sign up instantly without rate limits:
1. In your Supabase Dashboard, go to **Authentication** (left sidebar).
2. Under **Configuration**, click **Providers**.
3. Click **Email**.
4. Toggle **OFF** the switch for **"Confirm email"**.
5. Click **Save** at the bottom.

Now any user can create an account and immediately log into their private vault!

---

## ⚡ How to Start the Project Locally

```powershell
# 1. Navigate to the project directory
cd "c:\Users\Shubham\OneDrive\Desktop\GoFiles"

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:5173/
```

---

## 🛡️ Security Architecture

1. **Strictly Private Bucket:** `primefiles-storage` is private. Public access is disabled.
2. **Authenticated Downloads:** Files are downloaded via authenticated blob streams (`supabase.storage.from(...).download(...)`). Public URLs are never created.
3. **Structured Storage Paths:** Every uploaded file is isolated into the user's personal directory:
   `userId/uniqueId/originalFilename`
4. **Row Level Security Enforcement:** The database verifies `auth.uid()` against the first path segment. Client requests cannot bypass this policy.
5. **Zero Password Storage:** Passwords are never stored in `localStorage` or cookies.

---

## 📋 Features Implemented

1. **Authentication:**
   - Sign up with email & password.
   - Sign in with email & password.
   - Password reset request via email.
   - Secure session persistence & token auto-refresh.
   - Logout.
   - Protected dashboard routing with auth splash verification.
2. **File Storage:**
   - File picker supporting PDF, images, Word docs, spreadsheets, code, text, and ZIP archives.
   - 50MB file size validation.
   - Unique storage collision prevention.
   - Real-time file listing fetched exclusively from the authenticated user's folder.
   - Search by filename.
   - Download preserving original filename.
   - Delete with confirmation dialog.
3. **UI & Usability:**
   - Greeting displaying the authenticated user's email.
   - Storage quota bar and cross-device indicators (*Laptop, Phone, College PC*).
   - Responsive table & card views for mobile and desktop.
   - Empty, loading, and error states.
