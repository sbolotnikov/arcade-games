
import type { Metadata, Viewport } from 'next';
// @ts-ignore: side-effect import of global CSS
import './global.css';
import localFont from 'next/font/local'; 
import PwaRegistration from '@/components/PwaRegistration';

const arcadeClassic = localFont({
  src: [
    {
      path: './fonts/pixeloid_sans_bold.ttf',
      weight: '700',
    },
    
  ],
  variable: '--font-ArcadeClassic',
});
 
export const metadata: Metadata = {
   manifest: '/site.webmanifest',
   applicationName: 'Oldfashioned Arcade Games',
   title: 'Oldfashioned Arcade Games',
   appleWebApp: {
     capable: true,
     statusBarStyle: 'black-translucent',
     title: 'Arcade Games',
   },
   icons: {
     icon: [
       { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
       { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
     ],
     apple: '/apple-touch-icon.png',
   },
   description:
    'A collection of classic arcade games built with React. Choose your controls and aim for the high score in games like Tetris and Snake!',
     openGraph: {
    title: {
      template: '%s',
      default: 'Oldfashioned Arcade Games',
    },
    description:
      'A collection of classic arcade games built with React. Choose your controls and aim for the high score in games like Tetris and Snake!',
    url: process.env.NEXTAUTH_URL + '',
    type: 'website',
    images: [
      { url:  'https://arcade-games-rho.vercel.app/logo.jpg', width: 1200, height: 640 },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}
        className={`${arcadeClassic.variable} antialiased`}
      >
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
