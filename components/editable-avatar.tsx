"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { User as UserIcon, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditableAvatarProps {
    avatar?: string | null;
    name?: string;
    className?: string;
    size?: number;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1200; // Resize to max 1200px to reduce file size

async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            let { width, height } = img;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
                "image/jpeg",
                0.85
            );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
}

export function EditableAvatar({ avatar, name, className = "", size = 96 }: EditableAvatarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();

    const displaySrc = preview ?? avatar;

    const handleClick = () => {
        if (uploading) return;
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            toast.error("Please use JPEG, PNG, WebP or GIF");
            return;
        }
        if (file.size > MAX_SIZE) {
            toast.error("Image must be under 5MB");
            return;
        }

        setUploading(true);
        setPreview(URL.createObjectURL(file));

        try {
            let blob: Blob = file;
            if (file.size > 1024 * 1024) {
                blob = await compressImage(file);
            }

            const formData = new FormData();
            formData.append("file", blob, file.name.replace(/\.[^.]+$/, ".jpg"));

            const res = await fetch("/api/upload/avatar", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message ?? "Upload failed");
            }

            toast.success("Profile picture updated");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
            setPreview(null);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className={`relative shrink-0 rounded-full overflow-hidden ring-2 ring-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group ${className}`}
            style={{ width: size, height: size }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleChange}
                className="sr-only"
            />
            {displaySrc ? (
                <Image
                    src={displaySrc}
                    alt={name ?? "Profile"}
                    fill
                    className="object-cover"
                    sizes={`${size}px`}
                    unoptimized={displaySrc.startsWith("blob:")}
                />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <UserIcon
                        className="text-muted-foreground"
                        style={{ width: size / 2, height: size / 2 }}
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? (
                    <Loader2 className="size-8 text-white animate-spin" />
                ) : (
                    <Camera className="size-8 text-white" />
                )}
            </div>
        </button>
    );
}
