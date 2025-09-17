import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Notes Mading - Simple CRUD App",
  description: "A simple notes board application built with Next.js, Tailwind CSS, MongoDB and Cloudinary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Notes Mading. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
