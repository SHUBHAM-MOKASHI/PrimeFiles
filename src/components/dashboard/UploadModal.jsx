import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';
import { MAX_FILE_SIZE_BYTES } from '../../lib/storage';

export default function UploadModal({ isOpen, onClose, onUploadFile, isUploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [device, setDevice] = useState('Laptop');
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const validateAndSetFile = (file) => {
    setLocalError('');
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalError(`File size exceeds 50MB limit (${formatBytes(file.size)}). Please choose a smaller file.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || isUploading) return;

    try {
      await onUploadFile(selectedFile, device);
      setSelectedFile(null);
      setLocalError('');
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Upload failed. Please check your storage bucket setup.');
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setLocalError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-6 overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Upload File to PrimeFiles</h3>
            <p className="text-xs text-slate-400">Stores safely in your private cloud storage under your User ID</p>
          </div>
          <button
            onClick={() => {
              if (isUploading) return;
              resetSelection();
              onClose();
            }}
            disabled={isUploading}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Uploading from Device:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Laptop', 'Phone', 'College PC'].map((dev) => (
              <button
                key={dev}
                type="button"
                disabled={isUploading}
                onClick={() => setDevice(dev)}
                className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  device === dev
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone / File Picker */}
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 mx-auto flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">
              Click to select a file, or drag and drop
            </p>
            <p className="text-[11px] text-slate-400">
              PDF, Word (.docx), Excel, ZIP, Code, Images, or Text (Max 50 MB)
            </p>
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-800/50 text-blue-400 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-200 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatBytes(selectedFile.size)} • {selectedFile.type || 'Binary file'}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={resetSelection}
                  className="text-slate-500 hover:text-slate-300 p-1 text-xs cursor-pointer"
                  title="Remove selection"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Local Error feedback */}
        {localError && (
          <div className="mt-3 p-3 bg-rose-950/50 rounded-xl border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">{localError}</p>
          </div>
        )}

        {/* Storage path preview */}
        {selectedFile && !localError && (
          <div className="mt-3 p-2.5 bg-blue-950/40 rounded-xl border border-blue-800/30 text-[11px] text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">
              Target path: <code className="font-mono text-blue-200">userId/uniqueId/{selectedFile.name}</code>
            </span>
          </div>
        )}

        {/* Modal actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => {
              resetSelection();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={handleUploadSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
          >
            {isUploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading to Cloud...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Upload to Cloud</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
