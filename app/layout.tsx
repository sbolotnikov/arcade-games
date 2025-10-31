
import type { Metadata } from 'next'; 
import './global.css';
import localFont from 'next/font/local'; 

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
    title: 'Oldfashioned Arcade Games',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel="icon"
        href="/icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />
         
      <body suppressHydrationWarning={true}
        className={`${arcadeClassic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
