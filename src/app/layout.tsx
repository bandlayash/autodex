import "./globals.css";
import { DarkModeProvider } from "@/context/DarkModeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "autodex",
  description: "everything you need, all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <DarkModeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </DarkModeProvider>
      </body>

    </html>
  );
}
