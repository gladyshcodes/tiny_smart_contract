import { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { CrowdFundingProvider } from "../Context/CrowdFunding";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TinySmartContract",
  description: "Integrating front-end with smart contracts",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <CrowdFundingProvider>{children}</CrowdFundingProvider>
        </body>
      </html>
    </>
  );
}
