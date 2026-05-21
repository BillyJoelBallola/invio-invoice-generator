import { getInvoice } from "@/actions/invoice.action";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import InvoiceStatusSelect from "@/components/InvoiceStatusSelect";
import InvoiceActions from "@/components/InvoiceActions";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  DRAFT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) return notFound();

  return (
    <div className="space-y-6">
      <InvoiceActions invoice={invoice} />

      <div className="flex items-center justify-between">
        <div className="flex items-center md:gap-4">
          <BackButton />
          <h1 className="md:text-2xl font-semibold">{invoice.number}</h1>
        </div>
        <Badge className={statusColor[invoice.status]}>{invoice.status}</Badge>
      </div>

      {/* Invoice Info */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Client</p>
            <p className="font-semibold">{invoice.client.name}</p>
            <p className="text-muted-foreground">{invoice.client.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due Date</p>
            <p className="font-semibold">
              {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
            </p>
          </div>
          {invoice.notes && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Notes</p>
              <p>{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium">
            <span className="col-span-6">Description</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>
          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 text-sm">
              <span className="col-span-6">{item.description}</span>
              <span className="col-span-2 text-center">{item.quantity}</span>
              <span className="col-span-2 text-center font-mono">
                ₱{item.price.toLocaleString()}
              </span>
              <span className="col-span-2 text-right font-mono">
                ₱{(item.quantity * item.price).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-end pt-4 border-t">
            <div className="text-right space-y-1 min-w-48">
              <div className="flex justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">
                  ₱{invoice.subtotal.toLocaleString()}
                </span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between gap-8 text-sm">
                  <span className="text-muted-foreground">
                    Tax ({invoice.tax}%)
                  </span>
                  <span className="font-mono">
                    ₱{invoice.taxAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-8 pt-2 border-t">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold font-mono">
                  ₱{invoice.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <InvoiceStatusSelect
        invoiceId={invoice.id}
        currentStatus={invoice.status}
      />
    </div>
  );
}

export default InvoiceDetailPage;
