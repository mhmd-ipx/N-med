import { uploadFile, deleteFile } from '../../../services/serverapi';
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface FileUploadProps {
  onUrlChange?: (url: string | null) => void;
  initialFileUrl?: string | null;
  layout?: 'horizontal' | 'vertical'; // افقی یا عمودی
}

const FileUpload: React.FC<FileUploadProps> = ({ onUrlChange, initialFileUrl, layout = 'vertical' }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(initialFileUrl || null);
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(
    initialFileUrl ? initialFileUrl.replace('https://api.niloudarman.ir/storage/app/public/', 'https://api.niloudarman.ir/storage/') : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFileUrl(initialFileUrl || null);
    setOriginalFileUrl(
      initialFileUrl ? initialFileUrl.replace('https://api.niloudarman.ir/storage/app/public/', 'https://api.niloudarman.ir/storage/') : null
    );
  }, [initialFileUrl]);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      if (originalFileUrl) {
        try {
          await deleteFile(originalFileUrl);
        } catch (deleteError) {
          console.warn('خطا در حذف فایل قبلی:', deleteError);
        }
      }

      const response = await uploadFile(file);
      const displayUrl = response.file_url;
      const originalUrl = response.file_url.replace('https://api.niloudarman.ir/storage/app/public/', 'https://api.niloudarman.ir/storage/');
      setFileUrl(displayUrl);
      setOriginalFileUrl(originalUrl);
      onUrlChange?.(displayUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در آپلود فایل');
      onUrlChange?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDelete = async () => {
    if (!originalFileUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteFile(originalFileUrl);
      setFileUrl(null);
      setOriginalFileUrl(null);
      onUrlChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در حذف فایل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-md w-full bg-white rounded-xl transition-all duration-300 ${layout === 'horizontal' ? 'flex items-start justify-start gap-4' : 'flex flex-col'}`}>
      <div
        className={`flex border-2 border-dashed rounded-lg p-6 h-28 text-center items-center justify-center transition-colors duration-200 flex-1 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
          disabled={isLoading}
        />
        <label htmlFor="fileInput" className="cursor-pointer flex items-center justify-center gap-2">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-600 font-medium text-sm">
            {isDragging ? 'فایل را بکشید و رها کنید یا کلیک کنید' : 'فایل را بکشید و رها کنید یا کلیک کنید'}
          </span>
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center w-28 h-28 border border-gray-300 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center my-4 font-medium w-full">{error}</div>
      )}

      {fileUrl && !isLoading && (
        <div className={`mt-4 ${layout === 'horizontal' ? 'mt-0' : ''}`}>
          <div className="relative group w-28 h-28 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={fileUrl}
              alt="Uploaded file"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              onClick={handleDelete}
              className="absolute top-1 right-1 bg-red-300 text-red-700 hover:bg-red-500 p-1 rounded-full"
              disabled={isLoading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
