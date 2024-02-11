import { Inter } from "next/font/google";
import "./globals.css";
import SideNav from "@/components/SideNav";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-porsche  flex flex-col h-screen">
        <header className="bg-prosche">
          <Navbar />
        </header>
        <main className="flex flex-grow overflow-x-hidden">
          <SideNav />
          <div className="flex-1 p-4">
              {children}
          </div>
        </main>
      </body>
    </html>
  );
}
