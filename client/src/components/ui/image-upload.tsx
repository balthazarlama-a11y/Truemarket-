import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("Faltan credenciales de Cloudinary");
            return;
        }

        try {
            setIsUploading(true);
            const newUrls: string[] = [];

            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al subir imagen");
                }

                const data = await response.json();
                newUrls.push(data.secure_url);
            }

            onChange([...value, ...newUrls]);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    }, [value, onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        disabled: disabled || isUploading,
        multiple: true
    });

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    const isConfigured = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative overflow-hidden",
                    !isConfigured ? "border-destructive/50 bg-destructive/5 cursor-not-allowed" :
                        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    (disabled || isUploading) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} disabled={!isConfigured || disabled || isUploading} />
                <div className="flex flex-col items-center gap-2">
                    {isUploading ? (
                        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                    ) : !isConfigured ? (
                        <div className="text-destructive flex flex-col items-center">
                            <X className="h-10 w-10 mb-2" />
                            <p className="font-semibold">Configuración Incompleta</p>
                        </div>
                    ) : (
                        <Upload className="h-10 w-10 text-muted-foreground" />
                    )}

                    <p className="text-sm text-muted-foreground font-medium">
                        {!isConfigured
                            ? "Faltan variables de entorno de Cloudinary"
                            : isUploading
                                ? "Subiendo..."
                                : "Arrastra imágenes aquí o haz clic para seleccionar"}
                    </p>

                    {isConfigured && (
                        <p className="text-xs text-muted-foreground">
                            Soporta JPG, PNG, WEBP
                        </p>
                    )}
                </div>
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {value.map((url) => (
                        <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                            <img
                                src={url}
                                alt="Upload preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    onClick={() => removeImage(url)}
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
