import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '../globals.css';
import { cn } from 'cn';
import { Toaster } from '@/components/ui/sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const manrope = Manrope({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: 'MyNextJs-Start',
    description: 'Byme Alip Khairul'
};

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    if (!(routing.locales as readonly string[]).includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} className={cn(manrope.className, 'h-full antialiased')}>
            <body className="min-h-full flex flex-col light">
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
