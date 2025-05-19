import "./globals.css";
import type { Metadata } from "next";
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

const myFont = localFont({
  src: "../public/fonts/nasalization.woff2",
  variable: '--font-nasalization', 
});

export const metadata: Metadata = {
  title: "Applymandu - Your Gateway to Career Opportunities",
  description:
    "Find your dream job or hire the perfect candidate with Applymandu, the leading job board in Nepal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${myFont.variable} antialiased min-h-screen bg-neutral-50`}
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
          </AuthProvider>
        </ThemeProvider>
      <Toaster />

      </body>
    </html>
  );
}
