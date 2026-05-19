"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { InvoiceStatus } from "@/generated/prisma";

type Invoice = {
  number: string;
  status: InvoiceStatus;
  dueDate: Date;
  total: number;
  notes: string | null;
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

const statusColor: Record<InvoiceStatus, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  SENT: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        <Eye className="size-4" />
        Preview
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby=""
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-1 space-y-6 p-2">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold font-mono text-indigo-500">
                  Invio
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {invoice.number}
                </p>
              </div>
              <div className="text-right space-y-1">
                <Badge className={statusColor[invoice.status]}>
                  {invoice.status}
                </Badge>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-semibold">
                  {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                Bill To
              </p>
              <p className="font-semibold">{invoice.client.name}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.client.email}
              </p>
              {invoice.client.phone && (
                <p className="text-sm text-muted-foreground">
                  {invoice.client.phone}
                </p>
              )}
              {invoice.client.address && (
                <p className="text-sm text-muted-foreground">
                  {invoice.client.address}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Items
              </p>
              <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium py-2 border-b">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 text-sm py-2 border-b border-dashed"
                >
                  <span className="col-span-6">{item.description}</span>
                  <span className="col-span-2 text-center">
                    {item.quantity}
                  </span>
                  <span className="col-span-2 text-right font-mono">
                    ₱{item.price.toLocaleString()}
                  </span>
                  <span className="col-span-2 text-right font-mono">
                    ₱{(item.quantity * item.price).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-end pt-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold font-mono">
                    ₱{invoice.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">
                  Notes
                </p>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InvoicePreview;
