"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { deleteInvoice } from "@/actions/invoice.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileText, Pen, Pencil } from "lucide-react";
import { format } from "date-fns";
import { InvoiceStatus } from "@/generated/prisma";
import DeleteDialog from "@/components/dialog/DeleteDialog";

type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  total: number;
  dueDate: Date;
  client: { name: string };
};

const statusColor: Record<InvoiceStatus, string> = {
  DRAFT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteInvoice(id);
      if (response.error) return toast.error(response.error);
      toast.success("Invoice deleted.");
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="size-10 mx-auto mb-2 opacity-30" />
        <p>No invoices yet. Create your first invoice.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <Card key={invoice.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/invoices/${invoice.id}`)}
            >
              <p className="font-semibold">{invoice.number}</p>
              <p className="text-sm text-muted-foreground">
                {invoice.client.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Due {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-mono font-semibold">
                  ₱{invoice.total.toLocaleString()}
                </p>
                <Badge className={`text-xs ${statusColor[invoice.status]}`}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex items-center">
                <Link
                  href={`/invoices/${invoice.id}/edit`}
                  className="p-2 hover:bg-blue-900 rounded-lg duration-200"
                >
                  <Pencil className="size-4" />
                </Link>
                <DeleteDialog
                  description={`Are you sure you want to delete this invoice?`}
                  isDeleting={isDeleting}
                  handleDelete={handleDelete}
                  id={invoice.id}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default InvoiceList;
