'use client';

import { uploadersService } from '@/services/uploaders/uploaders.service';
import { ApiException } from '@/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

function ProfileForm() {
    const [imgPreview, setImgPreview] = useState('');

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async incomingFiles => {
            if (incomingFiles.length > 1) return;
            const image = incomingFiles[0];
            const imageTempUrl = URL.createObjectURL(image);
            setImgPreview(imageTempUrl);

            try {
                const data = await uploadersService.secureUploadSingleImage({ file: image, query: 'folder=responku/users-assets/profiles' });
                toast.success(`success upload: ${data.original_filename}`);
            } catch (exception) {
                if (exception instanceof ApiException) toast.error(exception.message);
            }
        }
    });

    useEffect(() => {
        return () => {
            if (imgPreview !== '') URL.revokeObjectURL(imgPreview);
        };
    }, [imgPreview]);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div {...getRootProps()} className={`w-35 h-35 md:h-40 md:w-40 border border-dashed border-black/50 rounded-2xl flex items-center justify-center cursor-pointer ${isDragActive ? 'bg-blue-500/10' : 'bg-neutral-100'}`}>
                <input {...getInputProps()} />1
                {isDragActive ? (
                    <Plus className="size-5 text-blue-400" />
                ) : (
                    <div className="flex flex-col gap-1 text-black/50 items-center justify-center">
                        <Plus className="size-5" />
                        <span className="text-sm">Tambah Gambar</span>
                    </div>
                )}
            </div>

            {imgPreview !== '' && (
                <figure
                    className="relative w-35 h-35 md:h-40 md:w-40 border border-dashed border-black/50 rounded-2xl bg-neutral-100 flex items-center
                            justify-center overflow-hidden"
                >
                    <Image className="absolute object-cover group-hover:scale-105 transition-transform duration-500" src={imgPreview} alt="img-preview" fill />
                </figure>
            )}
        </div>
    );
}

export default ProfileForm;
