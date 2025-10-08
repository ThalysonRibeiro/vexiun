import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/modeToggle";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalyst - Accelerate Your Team",
  description: "Collaborative task management platform that accelerates team productivity",
  keywords: ["task management", "collaboration", "productivity", "team work", "dev", "tasks", "task", "tarefas", "produtividade", "metas", "lista de metas", "kanban", "calendario",],
  authors: [{ name: "Thalyson Ribeiro" }],
  openGraph: {
    title: "Catalyst",
    description: "Accelerate your team's productivity",
    images: [``],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalyst - Accelerate Your Team",
    description: "Collaborative task management platform that accelerates team productivity",
    images: [``],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <SessionAuthProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider />
              <div className="absolute top-4 right-4 z-50">
                <ModeToggle />
              </div>
              {children}
            </ThemeProvider>
          </Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
