"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  vpa: z.string().min(1, { message: "VPA is required" }),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount must be greater than 0" })
    .optional(),
  name: z.string().min(1, { message: "Name is required" }),
  remark: z
    .string()
    .max(15, { message: "Remark must be under 15 characters" })
    .optional(),
});

export type UpiFormValues = z.infer<typeof formSchema>;

interface UpiFormProps {
  onSubmit: (values: UpiFormValues) => void;
}

function UpiForm({ onSubmit }: UpiFormProps) {
  const form = useForm<UpiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vpa: "",
      amount: undefined,
      name: "",
      remark: "",
    },
  });

  function handleSubmit(values: UpiFormValues) {
    onSubmit(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full perspective-1000"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full transform-gpu"
      >
        <Card className="w-full shadow-lg backdrop-blur-sm bg-background/80 border-t border-l border-neutral-200 overflow-hidden">
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-200/30 via-transparent to-neutral-300/20 rounded-lg opacity-70"
            animate={{
              backgroundImage: [
                "linear-gradient(to bottom right, rgba(200, 200, 200, 0.2), transparent, rgba(150, 150, 150, 0.2))",
                "linear-gradient(to bottom right, rgba(150, 150, 150, 0.2), transparent, rgba(200, 200, 200, 0.2))",
                "linear-gradient(to bottom right, rgba(200, 200, 200, 0.2), transparent, rgba(150, 150, 150, 0.2))",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <CardHeader>
            <CardTitle className="text-center font-heading">Generate UPI QR Code</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="vpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Payment Address (VPA)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="example@upi" 
                          {...field} 
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === "" ? undefined : Number(e.target.value);
                            field.onChange(value);
                          }}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payee Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark (max 15 chars)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Payment for..."
                          maxLength={15}
                          className="bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-neutral-950"
                  >
                    Generate QR Code
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Export both named and default exports for dynamic import
export { UpiForm };
export default UpiForm; 