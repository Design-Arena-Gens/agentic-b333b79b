import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "News to Telegram Agent",
  description:
    "Automated agent that finds breaking news and publishes summaries to Telegram."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
