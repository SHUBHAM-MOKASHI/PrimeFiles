import React from 'react';
import FileItemRow from './FileItemRow';
import FileItemCard from './FileItemCard';
import EmptyState from './EmptyState';

export default function FileList({
  files,
  viewMode = 'table',
  onDownload,
  onDelete,
  downloadingId,
  isFiltered,
  searchQuery,
  onResetSearch,
  onUploadClick,
}) {
  if (files.length === 0) {
    return (
      <EmptyState
        isFiltered={isFiltered}
        searchQuery={searchQuery}
        onResetSearch={onResetSearch}
        onUploadClick={onUploadClick}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <FileItemCard
              key={file.id}
              file={file}
              onDownload={onDownload}
              onDelete={onDelete}
              isDownloading={downloadingId === file.id}
            />
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/70">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 text-left text-xs font-semibold text-slate-400">
                    File Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-400 hidden sm:table-cell">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-400 hidden sm:table-cell">
                    Size
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-400 hidden md:table-cell">
                    Uploaded Date
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs font-semibold text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {files.map((file) => (
                  <FileItemRow
                    key={file.id}
                    file={file}
                    onDownload={onDownload}
                    onDelete={onDelete}
                    isDownloading={downloadingId === file.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
