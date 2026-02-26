import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { organizationSchema } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inviteera – Create Beautiful Online Invitations & Track RSVPs",
  description:
    "Inviteera is an online invitation maker to design, send, and track RSVPs for weddings, birthdays, corporate events, and more.",
  keywords: [
    "online invitation maker",
    "wedding invitation website",
    "digital invites",
    "RSVP tracking",
    "birthday invitation maker"
  ],
  openGraph: {
    title: "Inviteera – Online Invitation Maker",
    description:
      "Design stunning invitations and manage RSVPs in one place.",
    url: "https://inviteera.com",
    siteName: "Inviteera",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
                <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
