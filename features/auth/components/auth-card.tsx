'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';

interface AuthCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
}

const DEFAULT_CLOUDINARY_IMAGE = 'https://res.cloudinary.com/demo/image/upload/v1652345874/docs/demo_image.jpg';

export function AuthCard({ title, description, children, imageSrc = DEFAULT_CLOUDINARY_IMAGE, imageAlt = 'Authentication image' }: AuthCardProps) {
    return (
        <Card className="overflow-hidden ring-1 rounded-2xl bg-card p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-130">
                <div className="relative md:col-span-5 hidden md:block bg-slate-900 overflow-hidden">
                    <Image src={imageSrc} alt={imageAlt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                </div>

                <div className="md:col-span-7 flex flex-col justify-center p-6 sm:p-8 md:p-10 bg-card">
                    <CardHeader className="px-0 pt-0 pb-6 space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">{children}</CardContent>
                </div>
            </div>
        </Card>
    );
}
