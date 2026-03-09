import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { organizationSchema } from "@/lib/schema";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "InviteEra – Create Beautiful Digital Invitations & Live Countdown Timers",
  description:
    "Create stunning digital invitations with live countdown timers for weddings, baby showers, birthdays, and every milestone worth celebrating. Share via WhatsApp, Instagram, email, or print at home.",
  keywords: [
    "online invitation maker",
    "digital invitations",
    "wedding invitation website",
    "event invitations",
    "RSVP tracking",
    "countdown timer",
    "birthday invitation maker",
    "wedding invitations"
  ],
  openGraph: {
    title: "InviteEra – Beautiful Digital Invitations",
    description:
      "Create stunning digital invitations with live countdown timers for your special moments.",
    url: "https://InviteEra.com",
    siteName: "InviteEra",
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased`}
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
