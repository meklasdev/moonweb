import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoonCode - Profesjonalne realizacje Minecraft",
  description: "Profesjonalne usługi dla serwerów Minecraft - strony, grafiki, pluginy, budowle i więcej. Zaufali nam najlepsi!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased page-bg`}
      >
        <nav className="mc-navbar">
          <div className="mc-navbar-inner">
            <div className="mc-brand">MoonCode</div>
            <div className="mc-links">
              <a href="/">STRONA</a>
              <a href="/team">ZESPÓŁ</a>
              <a href="/skins">PORTFOLIO</a>
              <a href="/login">KONTAKT</a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
