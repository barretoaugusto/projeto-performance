import type { Metadata } from "next";
import "./globals.css";
import Menu from "./Menu";

export const metadata: Metadata = {
  title: "Projeto Performance",
  description: "Sistema de Gestão da Barreto Gestão",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Menu />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}