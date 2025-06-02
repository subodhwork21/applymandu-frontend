import "./globals.css";
import type { Metadata, Viewport } from "next";
import { inter } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { ApplicationProvider } from "@/lib/application-context";
import ApplicationPanel from "@/components/application-panel";
import LoginModal from "@/components/login-modal";
import RegisterModal from "@/components/register-modal";
import ForgotPasswordModal from "@/components/forgot-password-modal";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import TwoFactorModal from "@/components/TwoFactorModal";
import { Poppins } from 'next/font/google';

const myFont = localFont({
  src: "../public/fonts/nasalization.ttf",
  variable: '--font-nasalization', 
});

export const metadata: Metadata = {
  title: "Applymandu - Your Gateway to Career Opportunities",
  description:
    "Find your dream job or hire the perfect candidate with Applymandu, the leading job board in Nepal.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Your App Name',
  },
  icons: {
    icon: [
      { url: '/Ellipse.png' },
      { url: '/Ellipse.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/Ellipse.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};
    
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Ellipse.png" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Applymandu" />
      </head>
      <body
        className={`${poppins.className} ${myFont.variable} antialiased min-h-screen bg-neutral-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ApplicationProvider>
              {children}
              <ApplicationPanel />

              <LoginModal />
              <RegisterModal />
              <ForgotPasswordModal />
            </ApplicationProvider>
            <TwoFactorModal />
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
