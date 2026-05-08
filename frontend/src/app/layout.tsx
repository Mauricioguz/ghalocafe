import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Leonora | Gestión Agrícola",
  description: "Sistema inteligente de gestión financiera para fincas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <div className="flex">
          <Sidebar />
          <main className="ml-64 flex-1 min-h-screen p-8 bg-transparent">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
