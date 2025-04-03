import { cn } from "@/lib/utils";
import { Bricolage_Grotesque, Open_Sans } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "UPI QR Code Generator",
  description: "Generate UPI QR codes for easy payments",
  themeColor: "#f5f5f5",
};

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
});

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#f5f5f5" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
