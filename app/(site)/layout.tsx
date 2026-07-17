import { SiteHeader } from "@/app/_components/SiteHeader";

// Chrome for the public site only. The Studio route lives outside this group so
// it renders full-height with nothing above it — otherwise the header pushes
// Studio's bottom action bar (Publish) off-screen.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {children}
    </div>
  );
}
