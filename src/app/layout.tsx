import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { HydrationProvider } from "@/providers/hydration-provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DECODE-GOV - Sistema de Governança de Dados",
  description: "Sistema integrado para gestão e governança de dados corporativos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <HydrationProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </HydrationProvider>
      </body>
    </html>
  );
}
