"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { deleteInvoice } from "@/actions/invoice.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, FileText, Pencil } from "lucide-react";
import { format } from "date-fns";
import { InvoiceStatus } from "@/generated/prisma";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import CardMobileMenu from "@/components/CardMenu";

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

function InvoiceList({
  invoices,
  totalPages,
  currentPage,
}: {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/invoices?${params.toString()}`);
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
        <Card key={invoice.id} className="relative">
          <CardContent className="flex items-center justify-between py-4">
            {/* mobile card menu */}
            <CardMobileMenu
              dropDownMenuContent={
                <>
                  <Link
                    href={`/invoices/${invoice.id}/edit`}
                    className="p-2 pl-4 hover:bg-neutral-500/20 rounded-lg duration-200 flex items-center gap-2"
                  >
                    <Pencil className="size-4" />
                    <span className="text-sm">Edit</span>
                  </Link>
                  <DeleteDialog
                    description={`Are you sure you want to delete this invoice?`}
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                    btnText="Delete"
                    id={invoice.id}
                  />
                </>
              }
            />

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
              <div className="block md:hidden mt-4">
                <p className="text-lg font-mono font-semibold">
                  ₱{invoice.total.toLocaleString()}
                </p>
                <Badge className={`text-xs ${statusColor[invoice.status]}`}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-mono font-semibold">
                  ₱{invoice.total.toLocaleString()}
                </p>
                <Badge className={`text-xs ${statusColor[invoice.status]}`}>
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex items-center">
                <Link
                  href={`/invoices/${invoice.id}/edit`}
                  className="p-2 hover:bg-neutral-500/20 rounded-lg duration-200"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;
