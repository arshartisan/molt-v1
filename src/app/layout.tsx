import type { Metadata } from "next";
import { Host_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

// Same type system as the reference: Host Grotesk for display + body,
// Geist Mono for the small uppercase technical labels.
const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Molt - Keep your flock in view",
  description:
    "Camera-based poultry monitoring, connected camera views and flock records in one mobile app. A clearer view of your farms, barns and areas.",
  openGraph: {
    title: "Molt - Keep your flock in view",
    description: "Your counts, cameras and flock records. One clear view of your poultry farm.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Molt - Keep your flock in view",
    description: "Camera monitoring and flock records for poultry farms.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
