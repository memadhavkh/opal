import {ClerkProvider} from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";
import {Manrope} from 'next/font/google'
import { ThemeProvider } from '@/components/theme';
import ReactQueryProvider from '@/react-query';
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from 'sonner';

const manrope = Manrope({subsets: ['latin']})

export const metadata: Metadata = {
  title: "Video Sharing Platform",
  description: "Share AI Powered Videos With Your Friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${manrope.className} bg-[#171717]`}
      >
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReduxProvider>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </ReduxProvider>
      
    </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
