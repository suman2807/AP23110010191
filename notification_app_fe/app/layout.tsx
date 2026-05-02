import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/ThemeRegistry';
import Navbar from '@/components/Navbar';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Campus Notification Microservice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Navbar />
            <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
              {children}
            </main>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
