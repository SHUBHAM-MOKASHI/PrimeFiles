import React from 'react';
import { 
  FileText, 
  FileArchive, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  FileCode, 
  Video, 
  Music, 
  File 
} from 'lucide-react';

export default function FileIcon({ type = '', category = '', className = 'w-5 h-5' }) {
  const t = type.toLowerCase();
  const c = category.toLowerCase();

  if (t === 'pdf') {
    return (
      <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400 shrink-0">
        <FileText className={className} />
      </div>
    );
  }

  if (c === 'archives' || t === 'zip' || t === 'rar' || t === '7z') {
    return (
      <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 shrink-0">
        <FileArchive className={className} />
      </div>
    );
  }

  if (c === 'images' || ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(t)) {
    return (
      <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 shrink-0">
        <ImageIcon className={className} />
      </div>
    );
  }

  if (t === 'xlsx' || t === 'xls' || t === 'csv' || c === 'spreadsheets') {
    return (
      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
        <FileSpreadsheet className={className} />
      </div>
    );
  }

  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp'].includes(t)) {
    return (
      <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 shrink-0">
        <FileCode className={className} />
      </div>
    );
  }

  if (['mp4', 'mov', 'avi', 'mkv'].includes(t)) {
    return (
      <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 shrink-0">
        <Video className={className} />
      </div>
    );
  }

  if (['mp3', 'wav', 'aac'].includes(t)) {
    return (
      <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-800/40 text-pink-400 shrink-0">
        <Music className={className} />
      </div>
    );
  }

  return (
    <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 shrink-0">
      <File className={className} />
    </div>
  );
}
