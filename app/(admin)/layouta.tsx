import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { Metadata, Viewport } from "next/types";
import "../globals.css";

const myFont = localFont({
  src: "../../public/fonts/nasalization.ttf",
  variable: '--font-nasalization', 
});

export const metadata: Metadata = {
  title: "Applymandu - Your Gateway to Career Opportunities",
  description:
    "Find your dream job or hire the perfect candidate with Applymandu, the leading job board in Nepal.",
  manifest: '/manifest.json',
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
  themeColor: '#ffffff', // Add your theme color here
  width: 'device-width',
  initialScale: 1,
};
    
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({children}: {children: React.ReactNode}){
    return (
      <html lang="en" className={`${poppins.variable} ${myFont.variable}`}>
        <body>
          {children}
        </body>
      </html>
    );
}
