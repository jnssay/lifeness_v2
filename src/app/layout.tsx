import "~/styles/globals.css";
import { Raleway } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Lifeness",
  description: "Productivity for Ness",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <body className="min-h-screen bg-pink-200 font-raleway">
        <TRPCReactProvider>
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
