import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';
import ModalProvider from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import SocketProvider from '@/components/providers/socket-provider';

export const metadata: Metadata = {
  title: 'K-Discord',
  description: 'discord clone',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ko" suppressHydrationWarning>
        <body className="bg-white dark:bg-[#313338]">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
