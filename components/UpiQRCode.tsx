"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DownloadableQRCode } from "./DownloadableQRCode";
import { UpiFormValues } from "./UpiForm";

interface UpiQRCodeProps {
  data: UpiFormValues;
}

export function UpiQRCode({ data }: UpiQRCodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full perspective-1000"
    >
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5 }}
        whileTap={{ scale: 0.98 }}
        className="w-full transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="w-full shadow-lg backdrop-blur-sm bg-background/80 border-t border-l border-neutral-200 overflow-hidden">
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-tr from-neutral-200/30 via-transparent to-neutral-300/20 rounded-lg opacity-80"
            animate={{
              backgroundImage: [
                "linear-gradient(to top right, rgba(200, 200, 200, 0.2), transparent, rgba(150, 150, 150, 0.2))",
                "linear-gradient(to top right, rgba(150, 150, 150, 0.2), transparent, rgba(200, 200, 200, 0.2))",
                "linear-gradient(to top right, rgba(200, 200, 200, 0.2), transparent, rgba(150, 150, 150, 0.2))",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          <CardHeader>
            <CardTitle className="text-center font-heading">Your UPI QR Code</CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center">
            {/* Using a simpler implementation for downloads */}
            <DownloadableQRCode data={data} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}


export default UpiQRCode; 