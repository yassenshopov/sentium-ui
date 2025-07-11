import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import KeyboardShortcuts from "./KeyboardShortcuts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentium UI",
  description: "Sentium UI – A modern, minimal, and customizable React component library for building beautiful user interfaces.",
  icons: {
    icon: "/sentium-logo.svg",
    shortcut: "/sentium-logo.svg",
    apple: "/sentium-logo.svg",
  },
  openGraph: {
    title: "Sentium UI",
    description: "Sentium UI – A modern, minimal, and customizable React component library for building beautiful user interfaces.",
    url: "https://your-domain.com/",
    siteName: "Sentium UI",
    images: [
      {
        url: "/sentium-logo.svg",
        width: 1200,
        height: 630,
        alt: "Sentium UI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentium UI",
    description: "Sentium UI – A modern, minimal, and customizable React component library for building beautiful user interfaces.",
    images: ["/sentium-logo.svg"],
    creator: "@sentiumui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/sentium-logo.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#72e3ad" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <KeyboardShortcuts />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
