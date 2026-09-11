import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "URfolio Dashboard",
  description: "Edit URfolio's content.",
  // Keep the admin panel out of search results entirely.
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-espresso text-paper antialiased">{children}</body>
    </html>
  );
}
