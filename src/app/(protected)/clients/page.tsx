import { getClients } from "@/actions/client.action";
import ClientList from "@/components/ClientList";
import AddClientDialog from "@/components/dialog/ClientDialog";

export const dynamic = "force-dynamic";

async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <AddClientDialog />
      </div>
      <ClientList clients={clients ?? []} />
    </div>
  );
}

export default ClientsPage;
