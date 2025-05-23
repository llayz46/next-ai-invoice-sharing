"use client";

import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";

export function FormImageUpload({ onImageUploaded, isLoading }: { onImageUploaded: (file: File | FileMetadata | null) => void, isLoading: boolean }) {
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024;

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/*",
        maxSize,
        onFilesAdded: (addedFiles) => {
            const image = addedFiles[0].file;

            onImageUploaded(image);
        }
    });

    const handleRemoveFile = (fileId: string) => {
        removeFile(fileId);
        onImageUploaded(null);
    }

    const previewUrl = files[0]?.preview || null;

    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <div
                    role="button"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className="bg-muted border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-100 flex-col items-center justify-center overflow-hidden rounded-md border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
                >
                    {isLoading && (
                        <span className="absolute z-20 h-0.75 w-full bg-studio-700 animate-top-to-bottom" />
                    )}

                    <input
                        {...getInputProps()}
                        className="sr-only"
                        aria-label="Upload file"
                    />
                    {previewUrl ? (
                        <div className="absolute inset-0">
                            <Image
                                src={previewUrl}
                                alt={files[0]?.file?.name || "Uploaded image"}
                                width={100}
                                height={100}
                                className={cn(
                                    "size-full object-cover",
                                    isLoading && "opacity-75"
                                )}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                aria-hidden="true"
                            >
                                <ImageUpIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">
                                Drop your image here or click to browse
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Max size: {maxSizeMB}MB
                            </p>
                        </div>
                    )}
                </div>
                {previewUrl && (
                    <div className="absolute top-4 right-4">
                        <button
                            type="button"
                            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                            onClick={() => handleRemoveFile(files[0]?.id)}
                            aria-label="Remove image"
                        >
                            <XIcon className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div
                    className="text-destructive flex items-center gap-1 text-xs"
                    role="alert"
                >
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    );
}
