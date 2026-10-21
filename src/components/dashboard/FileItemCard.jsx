import React from 'react';
import { Download, Trash2, Smartphone, Laptop, Monitor } from 'lucide-react';
import FileIcon from './FileIcon';

export default function FileItemCard({ file, onDownload, onDelete, isDownloading }) {
  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Phone':
        return <Smartphone className="w-3.5 h-3.5 text-slate-500" title="Uploaded from Phone" />;
      case 'College PC':
        return <Monitor className="w-3.5 h-3.5 text-slate-500" title="Uploaded from College PC" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-slate-500" title="Uploaded from Laptop" />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <FileIcon type={file.type} category={file.category} />
          <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
            {file.type || 'FILE'}
          </span>
        </div>

        <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors" title={file.name}>
          {file.name}
        </h4>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
          <span className="font-medium text-slate-300">{file.sizeFormatted}</span>
          <div className="flex items-center gap-1">
            {getDeviceIcon(file.device)}
            <span>{file.device}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 truncate max-w-[120px]" title={file.uploadedDateFormatted}>
          {file.uploadedDateFormatted}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDownload(file)}
            disabled={isDownloading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-950/70 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Download file"
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download</span>
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
            title="Delete file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
