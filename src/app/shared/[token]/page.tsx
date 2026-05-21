import { getInvoiceByToken } from "@/actions/invoice.action";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  SENT: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invoice = await getInvoiceByToken(token);
  if (!invoice) return notFound();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono text-indigo-500">
            Invio
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{invoice.number}</p>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground uppercase">
            Bill To
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-semibold">{invoice.client.name}</p>
          <p className="text-muted-foreground">{invoice.client.email}</p>
          {invoice.client.phone && (
            <p className="text-muted-foreground">{invoice.client.phone}</p>
          )}
          {invoice.client.address && (
            <p className="text-muted-foreground">{invoice.client.address}</p>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground uppercase">
            Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium border-b pb-2">
            <span className="col-span-6">Description</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 text-sm border-b border-dashed pb-2"
            >
              <span className="col-span-6">{item.description}</span>
              <span className="col-span-2 text-center">{item.quantity}</span>
              <span className="col-span-2 text-right font-mono">
                ₱{item.price.toLocaleString()}
              </span>
              <span className="col-span-2 text-right font-mono">
                ₱{(item.quantity * item.price).toLocaleString()}
              </span>
            </div>
          ))}

          {/* Tax & Total */}
          <div className="flex justify-end pt-2">
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

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Powered by{" "}
        <span className="font-mono font-bold text-indigo-500">Invio</span>
      </p>
    </div>
  );
}

export default PublicInvoicePage;
