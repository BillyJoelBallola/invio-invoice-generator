import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStatus } from "@/generated/prisma";

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

function RecentInvoices({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">
            No invoices yet.
          </p>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/invoices/${invoice.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold">{invoice.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.client.name}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-mono font-semibold">
                    ₱{invoice.total.toLocaleString()}
                  </p>
                  <Badge className={`text-xs ${statusColor[invoice.status]}`}>
                    {invoice.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentInvoices;
