import React from "react"
import { Poppins } from 'next/font/google';
import localFont from "next/font/local";
import type { Metadata } from "next";
import { adminToken } from "@/lib/tokens";
import { redirect } from "next/navigation";
import { AdminAuthProvider } from "./context/auth-context";


const myFont = localFont({
  src: "../../../public/fonts/nasalization.ttf",
  variable: '--font-nasalization', 
});


// export const metadata: Metadata = {
//   title: "Applymandu - Your Gateway to Career Opportunities",
//   description:
//     "Find your dream job or hire the perfect candidate with Applymandu, the leading job board in Nepal.",
//      manifest: '/manifest.json',
//   themeColor: '#000000',
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: 'default',
//     title: 'Your App Name',
//   },
//   icons: {
//     icon: [
//       { url: '/Ellipse.png' },
//       { url: '/Ellipse.png', sizes: '192x192', type: 'image/png' },
//     ],
//     apple: [
//       { url: '/Ellipse.png', sizes: '192x192', type: 'image/png' },
//     ],
//   },
// };

    
    const poppins = Poppins({
      subsets: ['latin'],
      display: 'swap',
      variable: '--font-poppins',
      weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
    });
export default function AdminLayout({children}: {children: React.ReactNode}){


    return <html>
          {/* <head>
        <link rel="icon" href="/Ellipse.png" sizes="any" />
         <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Applymandu" />
      </head> */}
      <body
      suppressHydrationWarning={true}
        className={`${poppins.className} ${myFont.variable} antialiased min-h-screen bg-neutral-50`}
      >
        {
        children
    }
    </body>
    </html>

}