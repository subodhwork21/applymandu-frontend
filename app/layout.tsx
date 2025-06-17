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
import { Poppins } from "next/font/google";

const myFont = localFont({
  src: "../public/fonts/nasalization.ttf",
  variable: "--font-nasalization",
});

export const metadata: Metadata = {
  title: {
    default: "Applymandu - Your Dream Job Awaits",
    template: "%s - Applymandu - Your Dream Job Awaits",
  },
  description:
    "Whether you're seeking new opportunities or hiring talent, we connect the right people with the right positions.",
  keywords: [
    // Location-based keywords
    "jobs in Nepal",
    "jobs in Kathmandu",
    "jobs in Pokhara",
    "jobs in Lalitpur",
    "jobs in Bhaktapur",
    "Nepal employment",
    "Kathmandu careers",

    // Industry-specific keywords
    "IT jobs Nepal",
    "software developer jobs Nepal",
    "marketing jobs Nepal",
    "finance jobs Nepal",
    "banking jobs Nepal",
    "healthcare jobs Nepal",
    "education jobs Nepal",
    "engineering jobs Nepal",
    "sales jobs Nepal",
    "customer service jobs Nepal",

    // Job types
    "full time jobs Nepal",
    "part time jobs Nepal",
    "remote jobs Nepal",
    "freelance jobs Nepal",
    "internship Nepal",
    "entry level jobs Nepal",
    "senior level jobs Nepal",

    // General job search terms
    "job portal Nepal",
    "job search Nepal",
    "career opportunities",
    "recruitment Nepal",
    "hiring Nepal",
    "employment opportunities",
    "job board Nepal",
    "vacancies Nepal",
  ],
    authors: [{ name: "Applymandu Team" }],
  creator: "Applymandu",
  publisher: "Applymandu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://applymandu.com',
    siteName: 'Applymandu',
    title: 'Applymandu - Your Dream Job Awaits',
    description: 'Whether you\'re seeking new opportunities or hiring talent, we connect the right people with the right positions.',
    images: [
      {
        url: '/og-image.png', // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Applymandu - Job Portal Nepal',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Applymandu - Your Dream Job Awaits",
    description:
      "Whether you're seeking new opportunities or hiring talent, we connect the right people with the right positions.",
    creator: "@your_twitter_handle",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Your App Name",
  },
  icons: {
    icon: [
      { url: "/Ellipse.png" },
      { url: "/Ellipse.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/Ellipse.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
