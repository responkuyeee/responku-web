import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 bg-slate-50 dark:bg-slate-950 text-foreground">
            <div className="w-full max-w-4xl flex items-center justify-between mb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4" />
                    Back to Home
                </Link>
                <span className="text-sm font-semibold tracking-tight text-foreground">MyNextJs</span>
            </div>

            <div className="w-full max-w-4xl">{children}</div>
        </div>
    );
}
