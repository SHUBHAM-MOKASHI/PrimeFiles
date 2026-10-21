import React from 'react';
import { Download, Trash2, Smartphone, Laptop, Monitor } from 'lucide-react';
import FileIcon from './FileIcon';

export default function FileItemRow({ file, onDownload, onDelete, isDownloading }) {
  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Phone':
        return <Smartphone className="w-3 h-3 text-slate-500" title="Uploaded from Phone" />;
      case 'College PC':
        return <Monitor className="w-3 h-3 text-slate-500" title="Uploaded from College PC" />;
      default:
        return <Laptop className="w-3 h-3 text-slate-500" title="Uploaded from Laptop" />;
    }
  };

  return (
    <tr className="hover:bg-slate-850/60 transition-colors group border-b border-slate-800/80 last:border-0">
      {/* File Name & Icon */}
      <td className="py-3.5 pl-4 pr-3 sm:pl-6 text-sm">
        <div className="flex items-center gap-3">
          <FileIcon type={file.type} category={file.category} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-200 truncate max-w-xs sm:max-w-sm md:max-w-md group-hover:text-blue-400 transition-colors" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 sm:hidden">
              <span>{file.sizeFormatted}</span>
              <span>•</span>
              <span>{file.type?.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </td>

      {/* File Type Badge */}
      <td className="px-3 py-3.5 text-xs hidden sm:table-cell">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
          {file.type || 'FILE'}
        </span>
      </td>

      {/* File Size */}
      <td className="px-3 py-3.5 text-xs font-medium text-slate-400 hidden sm:table-cell whitespace-nowrap">
        {file.sizeFormatted}
      </td>

      {/* Upload Date & Device */}
      <td className="px-3 py-3.5 text-xs text-slate-400 hidden md:table-cell whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {getDeviceIcon(file.device)}
          <span>{file.uploadedDateFormatted}</span>
        </div>
      </td>

      {/* Action Buttons: Download & Delete */}
      <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          
          {/* Download Button */}
          <button
            type="button"
            onClick={() => onDownload(file)}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/60 hover:bg-blue-600 active:bg-blue-700 border border-blue-800/50 transition-all cursor-pointer disabled:opacity-50"
            title={`Download ${file.name}`}
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline">Download</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
            title={`Delete ${file.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>
      </td>
    </tr>
  );
}
