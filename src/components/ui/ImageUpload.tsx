import React, { useRef, useState } from 'react';
import { uploadService } from '../../services/uploadService';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  customUpload?: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Product Image',
  value,
  onChange,
  disabled = false,
  required = false,
  helperText = 'Supported formats: JPG, PNG, WEBP (Max 1MB)',
  customUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [previewError, setPreviewError] = useState(false);

  const displayImage = localPreview || value;

  const handleButtonClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input value so selecting the same file again triggers change
    if (e.target) e.target.value = '';

    if (!file) return;

    setUploadError(null);
    setPreviewError(false);

    // Create local preview immediately for responsive UX
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    setIsUploading(true);
    try {
      const uploader = customUpload || uploadService.uploadProductImage;
      const result = await uploader(file);
      if (result.success && result.url) {
        onChange(result.url);
        setLocalPreview(null); // Switch to remote URL
        setPreviewError(false);
      } else {
        setUploadError(result.error || 'Upload failed. Please try again.');
        // Revert local preview if upload failed
        setLocalPreview(null);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Network error during image upload.');
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    setUploadError(null);
    setLocalPreview(null);
    setPreviewError(false);
    onChange('');
  };

  return (
    <div className="w-full">
      {/* Label & Required indicator */}
      {label && (
        <label className="block font-label-sm text-label-sm text-on-surface-variant font-semibold mb-1.5">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload & Preview Container */}
      <div className="relative rounded-xl border border-outline-variant/40 bg-surface-container-low overflow-hidden transition-all">
        {displayImage ? (
          /* Preview State with Image, Replace and Remove Controls */
          <div className="p-3">
            <div className="relative group w-full h-44 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center border border-outline-variant/30">
              {previewError ? (
                <div className="flex flex-col items-center justify-center p-4 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] text-outline mb-1">broken_image</span>
                  <p className="text-body-xs text-outline">Image could not be loaded from remote URL</p>
                </div>
              ) : (
                <img
                  src={displayImage}
                  alt="Asset preview"
                  className="w-full h-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              )}

              {/* Uploading Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-surface-container-highest/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-body-sm font-label-md text-primary font-semibold">
                    Uploading image...
                  </span>
                </div>
              )}

              {/* Hover Action Bar */}
              {!isUploading && !disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="px-3 py-1.5 rounded-lg bg-surface text-on-surface text-body-sm font-semibold shadow-md hover:bg-surface-container flex items-center gap-1.5 transition-all active:scale-95"
                    title="Choose a different image"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container text-body-sm font-semibold shadow-md hover:bg-error-container/90 flex items-center gap-1.5 transition-all active:scale-95"
                    title="Remove this image"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar (Always visible for mobile & accessibility) */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-outline-variant/20">
              <span className="text-body-xs font-code-sm text-outline truncate max-w-[200px]" title={value}>
                {isUploading ? 'Uploading to cloud...' : value ? 'Cloud image saved' : 'Local preview'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={disabled || isUploading}
                  className="px-2.5 py-1 text-label-sm font-label-sm text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  <span>Change</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={disabled || isUploading}
                  className="px-2.5 py-1 text-label-sm font-label-sm text-error hover:bg-error-container/20 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Upload Call-to-Action State */
          <div
            onClick={handleButtonClick}
            className={`p-6 text-center cursor-pointer hover:bg-surface-container transition-all flex flex-col items-center justify-center ${
              disabled ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-body-sm font-label-md text-primary font-semibold">
                  Uploading image to cloud storage...
                </span>
                <span className="text-body-xs text-outline mt-1">Please wait a moment</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[28px]">add_photo_alternate</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-semibold shadow-xs flex items-center gap-2 mb-2 transition-all active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>Upload Image</span>
                </button>
                <p className="font-body-xs text-body-xs text-on-surface-variant font-medium">
                  Click to select an image from your computer
                </p>
                <span className="font-body-xs text-[11px] text-outline mt-1">
                  {helperText}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message Alert */}
      {uploadError && (
        <div className="mt-2 p-2.5 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-2 text-body-sm">
          <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">error</span>
          <div className="flex-1">
            <span className="font-semibold text-label-sm block">Upload Failed</span>
            <span className="text-body-xs text-on-surface-variant">{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-outline hover:text-on-surface text-[16px] leading-none"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
