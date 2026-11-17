import React, { useRef, useState } from 'react';
import { uploadService } from '../../services/uploadService';

interface MultiImageUploadProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
  helperText?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label = 'Product Images',
  values = [],
  onChange,
  disabled = false,
  maxImages = 6,
  helperText = 'Upload JPG, PNG, or WEBP (Max 1MB each). Up to 6 images allowed.',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceIndexRef = useRef<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);

  const handleOpenPicker = () => {
    if (disabled || isUploading || values.length >= maxImages) return;
    replaceIndexRef.current = null;
    fileInputRef.current?.click();
  };

  const handleOpenReplace = (index: number) => {
    if (disabled || isUploading) return;
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (e.target) e.target.value = '';
    if (files.length === 0) return;

    setUploadError(null);

    const availableSlots = maxImages - values.length;
    if (availableSlots <= 0) {
      setUploadError(`Maximum of ${maxImages} images allowed per product.`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      setUploadError(`Only ${availableSlots} more image${availableSlots > 1 ? 's' : ''} can be added (max ${maxImages}).`);
    }

    setIsUploading(true);
    const newUploadedUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadStatusText(`Uploading ${i + 1} of ${filesToUpload.length}: ${file.name}...`);

      const result = await uploadService.uploadProductImage(file);
      if (result.success && result.url) {
        newUploadedUrls.push(result.url);
      } else {
        errors.push(`${file.name}: ${result.error || 'Upload failed'}`);
      }
    }

    setIsUploading(false);
    setUploadStatusText(null);

    if (newUploadedUrls.length > 0) {
      onChange([...values, ...newUploadedUrls]);
    }

    if (errors.length > 0) {
      setUploadError(errors.join(' • '));
    }
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetIndex = replaceIndexRef.current;
    if (e.target) e.target.value = '';
    if (!file || targetIndex === null) return;

    setUploadError(null);
    setIsUploading(true);
    setUploadStatusText(`Replacing image with ${file.name}...`);

    try {
      const result = await uploadService.uploadProductImage(file);
      if (result.success && result.url) {
        const next = [...values];
        next[targetIndex] = result.url;
        onChange(next);
      } else {
        setUploadError(result.error || 'Failed to replace image.');
      }
    } finally {
      setIsUploading(false);
      setUploadStatusText(null);
      replaceIndexRef.current = null;
    }
  };

  const handleRemove = (index: number) => {
    if (disabled || isUploading) return;
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleMakePrimary = (index: number) => {
    if (disabled || isUploading || index === 0) return;
    const item = values[index];
    const next = [item, ...values.filter((_, i) => i !== index)];
    onChange(next);
  };

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
          {label} ({values.length}/{maxImages})
        </label>
        {values.length < maxImages && (
          <button
            type="button"
            onClick={handleOpenPicker}
            disabled={disabled || isUploading}
            className="text-label-sm font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
            <span>+ Add Images</span>
          </button>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleAddFiles}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        disabled={disabled || isUploading}
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFile}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Gallery Previews Container */}
      <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low p-3 transition-all">
        {values.length === 0 ? (
          /* Empty Call to Action */
          <div
            onClick={handleOpenPicker}
            className={`p-6 text-center cursor-pointer hover:bg-surface-container rounded-lg border-2 border-dashed border-outline-variant/40 transition-all flex flex-col items-center justify-center ${
              disabled ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-body-sm font-label-md text-primary font-semibold">
                  {uploadStatusText || 'Uploading images to cloud storage...'}
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-[28px]">collections</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-semibold shadow-xs flex items-center gap-2 mb-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>Select Product Images</span>
                </button>
                <p className="font-body-xs text-body-xs text-on-surface-variant font-medium">
                  Select one or multiple images from your computer
                </p>
                <span className="font-body-xs text-[11px] text-outline mt-0.5">
                  {helperText}
                </span>
              </>
            )}
          </div>
        ) : (
          /* Grid of uploaded images */
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {values.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group rounded-lg overflow-hidden bg-surface-container-high border border-outline-variant/30 aspect-square flex items-center justify-center shadow-xs"
                >
                  <img
                    src={url}
                    alt={`Product image ${idx + 1}`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Primary Thumbnail Badge */}
                  {idx === 0 ? (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-on-primary text-[10px] font-label-sm font-bold shadow-xs">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMakePrimary(idx)}
                      disabled={disabled || isUploading}
                      className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-surface/90 text-on-surface text-[10px] font-label-sm font-semibold opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-on-primary transition-all shadow-xs"
                      title="Set as main thumbnail"
                    >
                      Set Primary
                    </button>
                  )}

                  {/* Actions overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenReplace(idx)}
                      disabled={disabled || isUploading}
                      className="p-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container transition-colors shadow-sm"
                      title="Replace image"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      disabled={disabled || isUploading}
                      className="p-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error-container/90 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More Tile */}
              {values.length < maxImages && (
                <button
                  type="button"
                  onClick={handleOpenPicker}
                  disabled={disabled || isUploading}
                  className="rounded-lg border-2 border-dashed border-outline-variant/40 hover:border-primary/60 hover:bg-surface-container flex flex-col items-center justify-center aspect-square transition-all text-outline hover:text-primary disabled:opacity-50"
                  title="Add more images"
                >
                  <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                  <span className="text-[11px] font-semibold mt-1">Add Image</span>
                </button>
              )}
            </div>

            {/* In-flight upload indicator */}
            {isUploading && (
              <div className="mt-2.5 p-2 rounded-lg bg-primary/10 text-primary flex items-center gap-2 text-body-sm font-medium">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{uploadStatusText || 'Uploading image to cloud storage...'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {uploadError && (
        <div className="mt-2 p-2.5 rounded-lg bg-error-container/20 border border-error/30 text-error flex items-start gap-2 text-body-sm">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          <div className="flex-1">
            <span className="font-semibold text-label-sm block">Image Warning</span>
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
