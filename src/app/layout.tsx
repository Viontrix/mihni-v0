import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "مِهني - منصة القوالب والأدوات التعليمية",
  description:
    "مِهني - منصة القوالب والأدوات التعليمية الأولى في المملكة العربية السعودية. قوالب جاهزة وأدوات تنفيذية للكوادر التعليمية.",
  keywords:
    "قوالب تعليمية, نماذج تعليمية, شهادات تقدير, تقييم أداء, أدوات تعليمية, سعودية",
  authors: [{ name: "مِهني" }],
  openGraph: {
    title: "مِهني - منصة القوالب والأدوات التعليمية",
    description:
      "منصة متكاملة لإنشاء وإدارة القوالب التعليمية مع أدوات تنفيذية متقدمة",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232D6A4F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='7' width='20' height='14' rx='2' ry='2'/%3E%3Cpath d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D6A4F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-tajawal antialiased">
        <ThemeProvider>
          <Toaster position="top-center" richColors />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
