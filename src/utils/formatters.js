// Utility functions for formatting file sizes, dates, and types

export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileCategory(filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  
  const categories = {
    pdf: ['pdf'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
    document: ['doc', 'docx', 'txt', 'rtf', 'md'],
    spreadsheet: ['xls', 'xlsx', 'csv'],
    presentation: ['ppt', 'pptx', 'key'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz'],
    code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'json', 'cpp', 'java'],
    video: ['mp4', 'mov', 'avi', 'mkv'],
    audio: ['mp3', 'wav', 'aac', 'm4a']
  };

  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) {
      return category;
    }
  }

  return 'other';
}

export function getFileTypeBadge(filename = '') {
  const ext = filename.split('.').pop().toUpperCase();
  return ext || 'FILE';
}
