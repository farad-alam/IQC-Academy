import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "IQC Academy — ইসলাম শেখার আনন্দময় প্ল্যাটফর্ম",
  description: "IQC Academy-তে কুরআন, হাদিস ও ইসলামি জ্ঞান শিখুন। কোর্স, কুইজ এবং অনলাইন মাদ্রাসার মাধ্যমে দ্বীন শেখার আনন্দ উপভোগ করুন।",
  keywords: "IQC Academy, ইসলামি শিক্ষা, কুরআন, হাদিস, অনলাইন মাদ্রাসা, ইসলামিক কোর্স",
  openGraph: {
    title: "IQC Academy",
    description: "ইসলাম শেখার একটি আনন্দময় ও অনুপ্রেরণাদায়ক প্ল্যাটফর্ম",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
