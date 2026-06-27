import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PollApp — Real-time Polling",
  description: "Create polls, share them, and watch results update live in real time. Free and easy to use.",
  keywords: ["polling app", "real-time poll", "live voting", "create poll", "online survey"],
  authors: [{ name: "Ayeni Opeyemi Joseph", url: "https://ayeni-opeyemi.vercel.app" }],
  creator: "Ayeni Opeyemi Joseph",
  openGraph: {
    title: "PollApp — Real-time Polling",
    description: "Create polls, share them, and watch results update live in real time.",
    url: "https://polling-app-lhbe.vercel.app",
    siteName: "PollApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PollApp — Real-time Polling",
    description: "Create polls, share them, and watch results update live in real time.",
    creator: "@tee_jay_fx",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
