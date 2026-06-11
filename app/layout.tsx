import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rodrigo Herrera | Web Developer",
  description:
    "Portfolio of Rodrigo Herrera, a fullstack web developer focused on scalable, production-ready applications.",
  metadataBase: new URL("https://rodrigoherrera.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rodrigo Herrera | Web Developer",
    description:
      "Fullstack developer portfolio featuring web applications, APIs, and production deployments.",
    url: "https://rodrigoherrera.dev",
    siteName: "Rodrigo Herrera",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Rodrigo Herrera",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo Herrera | Web Developer",
    description:
      "Fullstack developer portfolio featuring web applications, APIs, and production deployments.",
    images: ["/profile.jpg"],
  },
  icons: {
    icon: "/fossil-illustration-2-svgrepo-com.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.variable}>
      <body className="font-[var(--font-rubik)] antialiased">{children}</body>
    </html>
  );
}
