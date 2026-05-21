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
import InvoicePreview from "@/components/InvoicePreview";
import ShareInvoiceButton from "@/components/ShareInvoiceButton";

type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  dueDate: Date;
  total: number;
  subtotal: number;
  tax: number;
  taxAmount: number;
  notes: string | null;
  shareToken: string | null;
  client: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    price: number;
  }[];
};

function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await generateInvoicePDF(invoice.id);
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
      a.download = response.filename ?? `${invoice.number}.pdf`;
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
      const response = await sendInvoiceEmail(invoice.id);
      if (response.error) return toast.error(response.error);

      // auto update status to SENT
      if (invoice.status === "DRAFT") {
        await updateInvoiceStatus({ id: invoice.id, status: "SENT" });
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
    <div className="flex flex-wrap items-center gap-2">
      <InvoicePreview invoice={invoice} />
      <ShareInvoiceButton
        invoiceId={invoice.id}
        shareToken={invoice.shareToken ?? null}
      />
      <Button
        className="cursor-pointer"
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className="size-4" />
        <span className="hidden md:block">
          {isDownloading ? "Downloading..." : "Download PDF"}
        </span>
      </Button>
      <Button className="cursor-pointer" onClick={handleSend} disabled>
        <Send className="size-4" />
        <span className="hidden md:block">
          {isSending ? "Sending..." : "Send Invoice"}
        </span>
      </Button>
    </div>
  );
}

export default InvoiceActions;
