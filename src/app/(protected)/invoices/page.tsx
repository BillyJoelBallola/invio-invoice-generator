import { getInvoices } from "@/actions/invoice.action";
import InvoiceList from "@/components/InvoiceList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Link href="/invoices/new">
          <Button>
            <Plus className="size-4" />
            New Invoice
          </Button>
        </Link>
      </div>
      <InvoiceList invoices={invoices ?? []} />
    </div>
  );
}

export default InvoicesPage;
