import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import Spinner from "./components/Spinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Register | FlexMania - Manan",
  description: "FlexMania - An event organized by Manan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../public/Manan_Logo.ico" />
      </Head>
      <body className={`${inter.className} bg-cover bg-center`}>
        <div
          className="w-full h-full min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/background_image.jpeg')" }}
        >
          <div className=" flex flex-col">
            <ClerkProvider>
              <ClerkLoading>
                <Spinner />
              </ClerkLoading>
              <ClerkLoaded>
                <main className="flex-grow container mx-auto px-4 py-6 shadow-md">
                  {children}
                </main>
              </ClerkLoaded>
              <Toaster />
            </ClerkProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
