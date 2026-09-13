import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { cn } from 'cn';
import { Toaster } from '@/components/ui/sonner';

const manrope = Manrope({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'MyNextJs-Start',
    description: 'Byme Alip Khairul'
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={cn(manrope.className, 'h-full antialiased')}>
            <body className="min-h-full flex flex-col dark">
                {children}
                <Toaster />
            </body>
        </html>
    );
}
