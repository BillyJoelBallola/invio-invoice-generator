import { getClients } from "@/actions/client.action";
import ClientList from "@/components/ClientList";
import ClientFilters from "@/components/filters/ClientFilters";
import ClientDialog from "@/components/dialog/ClientDialog";

export const dynamic = "force-dynamic";

async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const filters = await searchParams;
  const result = await getClients({
    search: filters.search,
    page: filters.page ? Number(filters.page) : 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <ClientDialog />
      </div>

      <ClientFilters currentSearch={filters.search ?? ""} />

      <ClientList
        clients={result?.clients ?? []}
        totalPages={result?.pages ?? 1}
        currentPage={result?.page ?? 1}
      />
    </div>
  );
}

export default ClientsPage;
