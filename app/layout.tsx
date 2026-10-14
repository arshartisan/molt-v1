import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Molt — Keep your flock in view",
  description: "Camera-based poultry monitoring, connected camera views and flock records in one mobile app. A clearer view of your farms, barns and areas.",
  openGraph: { title: "Molt — Keep your flock in view", description: "Your counts, cameras and flock records. One clear view of your poultry farm.", type: "website" },
  twitter: { card: "summary", title: "Molt — Keep your flock in view", description: "Camera monitoring and flock records for poultry farms." },
  icons: { icon: "/brand/molt-icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={inter.variable}><body>{children}</body></html>;
}
