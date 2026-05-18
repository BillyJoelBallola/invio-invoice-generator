import { getClients } from "@/actions/client.action";
import { getInvoice } from "@/actions/invoice.action";
import BackButton from "@/components/BackButton";
import InvoiceForm from "@/components/form/InvoiceForm";
import { notFound } from "next/navigation";

async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, clients] = await Promise.all([getInvoice(id), getClients()]);

  if (!invoice) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Edit Invoice</h1>
      </div>
      <InvoiceForm clients={clients ?? []} invoice={invoice} />
    </div>
  );
}

export default EditInvoicePage;
