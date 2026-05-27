'use client';

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = useCallback(
    (file: File) => {
      setError(null);
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [maxSizeMB, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSetFile(file);
    },
    [validateAndSetFile]
  );

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-[26px] border-2 border-dashed px-6 py-12 transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-vedaai-accent bg-orange-50'
            : 'border-gray-300 bg-gray-50 hover:border-vedaai-accent hover:bg-orange-50/30',
          error && 'border-vedaai-error'
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <CloudUpload className="mb-3 h-10 w-10 text-gray-400" />

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-vedaai-text">
              {selectedFile.name}
            </p>
            <p className="text-xs text-vedaai-text-secondary mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-vedaai-text">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs text-vedaai-text-secondary mt-1">
              JPEG, PNG, PDF up to {maxSizeMB}MB
            </p>
          </div>
        )}

        <button
          type="button"
          className="mt-5 rounded-full border border-vedaai-border bg-white px-5 py-2 text-sm font-medium text-vedaai-text hover:bg-gray-50 transition-colors shadow-sm"
        >
          Browse Files
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-vedaai-error">{error}</p>}
    </div>
  );
}
