import { Geist, Geist_Mono } from "next/font/google";
import { Kalam } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import Footer from "@/components/Footer";
import Clock from "@/components/Clock";
import BoardDecorations from "@/components/BoardDecorations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const handwriting = Kalam({
  weight: ['400', '700'],
  variable: "--font-handwriting",
  subsets: ["latin"],
});

export const metadata = {
  title: "Notes Mading - Simple CRUD App",
  description: "A simple notes board application built with Next.js, Tailwind CSS, MongoDB and Cloudinary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tambahkan meta tags untuk mencegah caching */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Script untuk memaksa refresh jika perubahan tidak terlihat */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Check if browser environment
            if (typeof window !== 'undefined') {
              // Force refresh if data not updating
              if (window.location.pathname === '/') {
                try {
                  sessionStorage.setItem('lastVisit', Date.now());
                  
                  // Check for stale data
                  window.addEventListener('focus', function() {
                    const lastVisit = sessionStorage.getItem('lastVisit');
                    const now = Date.now();
                    // If it's been more than 30 seconds since last visit, refresh
                    if (lastVisit && (now - lastVisit > 30000)) {
                      sessionStorage.setItem('lastVisit', now);
                      window.location.reload();
                    }
                  });
                } catch (e) {
                  console.log('Session storage not available');
                }
              }
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${handwriting.variable} antialiased min-h-screen`}
        style={{ marginRight: "0px" }}
      >
        <BackgroundEffects />
        <BoardDecorations count={10} />
        <div className="flex flex-col min-h-screen relative z-10">
          <Navbar />
          {/* Pindahkan jam ke bawah navbar dengan posisi fixed */}
          <div className="fixed top-20 right-4 z-20 hidden md:block">
            <Clock />
          </div>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
