"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, Send } from "lucide-react";
import { generateInvoicePDF } from "@/actions/pdf.action";
import { sendInvoiceEmail } from "@/actions/email.action";
import { updateInvoiceStatus } from "@/actions/invoice.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InvoiceStatus } from "@/generated/prisma";

function InvoiceActions({
  invoiceId,
  invoiceNumber,
  currentStatus,
}: {
  invoiceId: string;
  invoiceNumber: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await generateInvoicePDF(invoiceId);
      if (response.error) return toast.error(response.error);
      if (!response.buffer) return;

      // convert base64 to blob and download
      const byteArray = Uint8Array.from(atob(response.buffer), (c) =>
        c.charCodeAt(0),
      );
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = response.filename ?? `${invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("An error occurred while downloading.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const response = await sendInvoiceEmail(invoiceId);
      if (response.error) return toast.error(response.error);

      // auto update status to SENT
      if (currentStatus === "DRAFT") {
        await updateInvoiceStatus({ id: invoiceId, status: "SENT" });
        router.refresh();
      }

      toast.success("Invoice sent to client.");
    } catch {
      toast.error("An error occurred while sending.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className="size-4" />
        {isDownloading ? "Downloading..." : "Download PDF"}
      </Button>
      <Button className="cursor-pointer" onClick={handleSend} disabled>
        <Send className="size-4" />
        {isSending ? "Sending..." : "Send Invoice"}
      </Button>
    </div>
  );
}

export default InvoiceActions;
