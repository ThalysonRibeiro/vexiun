import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/modeToggle";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: "Vexiun - AI-Powered Project Management",
    template: "%s | Vexiun"
  },
  description:
    "Project management with AI. Analyze repositories, create tasks automatically, and manage your team efficiently.",
  keywords: ["project management", "ai", "github", "tasks", "team"],
  authors: [{ name: "Vexiun" }],
  creator: "Vexiun",
  openGraph: {
    type: "website",
    images: [``],
    locale: "pt_BR",
    url: "https://vexiun.com",
    title: "Vexiun - AI-Powered Project Management",
    description: "Project management with AI",
    siteName: "Vexiun"
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true
    }
  },
  twitter: {
    card: "summary_large_image",
    title: "Vexiun - AI-Powered Project Management",
    description: "Project management with AI",
    creator: "@vexiun",
    images: [``]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
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
              <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
            </ThemeProvider>
          </Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
