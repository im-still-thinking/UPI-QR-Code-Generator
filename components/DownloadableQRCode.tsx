"use client";

import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { UpiFormValues } from "./UpiForm";

interface DownloadableQRCodeProps {
  data: UpiFormValues;
}

export function DownloadableQRCode({ data }: DownloadableQRCodeProps) {
  const qrCodeRef = useRef<HTMLCanvasElement | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [upiLogoLoaded, setUpiLogoLoaded] = useState(false);

  // Preload the UPI logo
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setUpiLogoLoaded(true);
    };
    img.src = "/upi.svg";
  }, []);

  // Store reference to the QR code canvas
  useEffect(() => {
    if (qrContainerRef.current) {
      const canvas = qrContainerRef.current.querySelector('canvas');
      if (canvas) {
        qrCodeRef.current = canvas;
      }
      
      const logo = qrContainerRef.current.querySelector('img');
      if (logo) {
        logoRef.current = logo;
      }
    }
  }, [upiLogoLoaded, data.vpa]);

  // Build the UPI URL
  const buildUpiUrl = () => {
    let upiUrl = `upi://pay?pa=${data.vpa}&pn=${encodeURIComponent(data.name)}`;
    
    if (data.amount) {
      upiUrl += `&am=${data.amount}`;
    }
    
    if (data.remark) {
      upiUrl += `&tn=${encodeURIComponent(data.remark)}`;
    }
    
    return upiUrl;
  };

  // Create a new canvas with the QR code and text
  const createCanvasWithQR = () => {
    if (!qrCodeRef.current) {
      throw new Error("QR code canvas not found");
    }

    // Create a new canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set dimensions with padding
    const padding = 40;
    const textHeight = 60;
    canvas.width = qrCodeRef.current.width + padding * 2;
    canvas.height = qrCodeRef.current.height + padding * 2 + textHeight;

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get QR code image data and modify it to be darker
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = qrCodeRef.current.width;
    tempCanvas.height = qrCodeRef.current.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    if (tempCtx) {
      // Draw original QR to temp canvas
      tempCtx.drawImage(qrCodeRef.current, 0, 0);
      
      // Get image data
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      
      // Enhance contrast - make dark pixels pure black
      for (let i = 0; i < data.length; i += 4) {
        // If pixel is not white (not 255)
        if (data[i] < 200) {
          // Make it pure black
          data[i] = 0;     // R
          data[i + 1] = 0; // G
          data[i + 2] = 0; // B
        }
      }
      
      // Put enhanced image data back
      tempCtx.putImageData(imageData, 0, 0);
      
      // Draw enhanced QR code
      ctx.drawImage(tempCanvas, padding, padding);
    } else {
      // Fallback to original QR code if enhancement fails
      ctx.drawImage(qrCodeRef.current, padding, padding);
    }

    // Draw UPI logo if available
    if (upiLogoLoaded && logoRef.current) {
      const centerX = qrCodeRef.current.width / 2 + padding;
      const centerY = qrCodeRef.current.height / 2 + padding;
      const logoSize = 40;
      
      // Draw white background for logo
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(
        centerX - logoSize / 2 - 5,
        centerY - logoSize / 2 - 5,
        logoSize + 10,
        logoSize + 10
      );
      
      // Draw the logo
      ctx.drawImage(
        logoRef.current,
        centerX - logoSize / 2,
        centerY - logoSize / 2,
        logoSize,
        logoSize
      );
    }

    // Add text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    const centerX = canvas.width / 2;

    ctx.fillText(`Scan to pay ${data.name}`, centerX, qrCodeRef.current.height + padding + 30);

    if (data.amount) {
      ctx.font = '14px Arial';
      ctx.fillText(`Amount: ₹${data.amount}`, centerX, qrCodeRef.current.height + padding + 55);
    }

    return canvas;
  };

  const handleDownloadPNG = async () => {
    try {
      setIsDownloading(true);
      
      const canvas = createCanvasWithQR();
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            saveAs(blob, `UPI-QR-${data.vpa}.png`);
          } else {
            throw new Error("Could not create blob");
          }
        },
        'image/png',
        1.0
      );
    } catch (error) {
      console.error("Error downloading PNG:", error);
      alert("Failed to download QR code. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const canvas = createCanvasWithQR();
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with A5 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to maintain aspect ratio
      const imgWidth = 100; // Larger QR code
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title with styling
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 51, 51);
      pdf.text("UPI QR Code", pageWidth / 2, 25, { align: "center" });
      
      // Add QR code centered
      pdf.addImage(
        imgData, 
        'PNG', 
        pageWidth / 2 - imgWidth / 2, 
        35, 
        imgWidth, 
        imgHeight
      );
      
      // Add scan instructions
      const scanY = 35 + imgHeight + 15;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 51, 51);
      pdf.text(`Scan to pay ${data.name}`, pageWidth / 2, scanY, { align: "center" });
      
      if (data.amount) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Amount: ₹${data.amount}`, pageWidth / 2, scanY + 8, { align: "center" });
      }
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Generated with UPI QR Code Generator", pageWidth / 2, pageHeight - 10, { align: "center" });
      
      pdf.save(`UPI-QR-${data.vpa}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download QR code PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Define QR code colors - neutral colors
  const qrCodeColors = {
    dark: "#000000", // Pure black for better contrast
    light: "#FFFFFF", // White background
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      <div 
        ref={qrContainerRef}
        className="p-6 bg-white rounded-xl border border-gray-300 capture-this"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          padding: "20px"
        }}
      >
        {/* Using QRCodeCanvas for better image capture */}
        <div className="relative flex items-center justify-center">
          <QRCodeCanvas
            value={buildUpiUrl()}
            size={200}
            level="H"
            includeMargin={true}
            bgColor={qrCodeColors.light}
            fgColor={qrCodeColors.dark}
          />
          {/* Center UPI logo */}
          {upiLogoLoaded && (
            <div 
              className="absolute flex items-center justify-center" 
              style={{ 
                width: "50px", 
                height: "50px", 
                backgroundColor: "#fff", 
                padding: "5px", 
                borderRadius: "8px" 
              }}
            >
              <img 
                src="/upi.svg" 
                alt="UPI" 
                width={40} 
                height={40}
                style={{ display: "block", width: "100%", height: "100%" }}
              />
            </div>
          )}
        </div>
        <div className="mt-4 text-center" style={{ color: "#333333" }}>
          <p className="font-medium font-heading">Scan to pay {data.name}</p>
          {data.amount && <p className="font-sans">Amount: ₹{data.amount}</p>}
        </div>
      </div>
      
      <div className="mt-4 flex gap-2 w-full">
        <Button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          variant="outline"
          className="w-1/2"
        >
          {isDownloading ? "Processing..." : "Download PNG"}
        </Button>
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-1/2"
        >
          {isDownloading ? "Processing..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
} 