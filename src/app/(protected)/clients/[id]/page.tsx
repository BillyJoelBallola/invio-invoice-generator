import { getClient } from "@/actions/client.action";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) return notFound();

  const statusColor: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    SENT: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-2xl font-semibold">{client.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {client.email}
          </p>
          {client.phone && (
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {client.phone}
            </p>
          )}
          {client.address && (
            <p>
              <span className="text-muted-foreground">Address:</span>{" "}
              {client.address}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {client.invoices.length === 0 ? (
            <p className="text-muted-foreground text-sm">No invoices yet.</p>
          ) : (
            <div className="space-y-3">
              {client.invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{invoice.number}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge className={statusColor[invoice.status]}>
                    {invoice.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ClientDetailPage;
