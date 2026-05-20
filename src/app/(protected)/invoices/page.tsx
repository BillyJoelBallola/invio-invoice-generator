import { getInvoices } from "@/actions/invoice.action";
import InvoiceList from "@/components/InvoiceList";
import InvoiceFilters from "@/components/filters/InvoiceFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const filters = await searchParams;
  const result = await getInvoices({
    status: filters.status,
    search: filters.search,
    page: filters.page ? Number(filters.page) : 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Invoices</h1>
        <Link href="/invoices/new">
          <Button>
            <Plus className="size-4" />
            <span className="hidden md:block">New Invoice</span>
          </Button>
        </Link>
      </div>

      <InvoiceFilters
        currentStatus={filters.status ?? "ALL"}
        currentSearch={filters.search ?? ""}
      />

      <InvoiceList
        invoices={result?.invoices ?? []}
        totalPages={result?.pages ?? 1}
        currentPage={result?.page ?? 1}
      />
    </div>
  );
}

export default InvoicesPage;
