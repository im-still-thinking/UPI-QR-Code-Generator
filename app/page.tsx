"use client";

import { ClientOnly } from "@/components/ClientOnly";
import dynamic from "next/dynamic";
import { useState } from "react";

const UpiForm = dynamic(() => import("@/components/UpiForm").then(mod => mod.UpiForm), {
  ssr: false,
});

const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground").then(mod => mod.AnimatedBackground), {
  ssr: false,
});

// Dynamically import the QR code component to avoid SSR issues
const UpiQRCode = dynamic(() => import("@/components/UpiQRCode").then(mod => mod.UpiQRCode), {
  ssr: false,
});

import type { UpiFormValues } from "@/components/UpiForm";

export default function Home() {
  const [qrData, setQRData] = useState<UpiFormValues | null>(null);

  const handleFormSubmit = (values: UpiFormValues) => {
    setQRData(values);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-8 relative">
      <ClientOnly>
        <AnimatedBackground />
      </ClientOnly>
      
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center">UPI QR Code Generator</h1>
        
        <div className={`w-full flex flex-col ${qrData ? "lg:flex-row" : ""} gap-8 justify-center items-center`}>
          <div className="w-full max-w-md">
            <ClientOnly fallback={<div className="p-8 text-center">Loading form...</div>}>
              <UpiForm onSubmit={handleFormSubmit} />
            </ClientOnly>
          </div>
          
          {qrData && (
            <div className="w-full max-w-md flex items-center justify-center mt-4 lg:mt-0">
              <ClientOnly fallback={<div className="p-8 text-center">Loading QR Code...</div>}>
                <UpiQRCode data={qrData} />
              </ClientOnly>
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-500 z-10">
        <p>Made with ❤️ for easy UPI payments</p>
      </footer>
    </div>
  );
}
