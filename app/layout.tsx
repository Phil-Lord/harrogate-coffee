import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Geist_Mono, Inter, Merriweather } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harrogate Coffee Shops",
  description: "A list of the best coffee shops in Harrogate.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", inter.variable, merriweather.variable)}
    >
      <body>
        {children}
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
