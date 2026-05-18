import InvoiceForm from "@/components/form/InvoiceForm";
import { getClients } from "@/actions/client.action";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

async function NewInvoicePage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">New Invoice</h1>
      </div>
      <InvoiceForm clients={clients ?? []} />
    </div>
  );
}

export default NewInvoicePage;
