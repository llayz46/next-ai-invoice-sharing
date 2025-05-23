import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { SquaresExclude } from 'lucide-react';
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ReactNode } from "react";
import { InvoiceProvider } from "../src/context/InvoiceContext";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <InvoiceProvider>
                        <header className="flex items-center justify-between py-4 px-5 border-b">
                            <Link href="/">
                                <SquaresExclude className="size-5" color="var(--color-studio-600)" />
                            </Link>

                            <ThemeToggle />
                        </header>

                        {children}
                    </InvoiceProvider>
                </ThemeProvider>

                <Toaster />
            </body>
        </html>
    );
}
