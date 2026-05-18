"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Users } from "lucide-react";
import { deleteClient } from "@/actions/client.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClientDialog from "@/components/dialog/ClientDialog";
import DeleteDialog from "@/components/dialog/DeleteDialog";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  _count: { invoices: number };
};

function ClientList({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteClient(id);
      if (response.error) return toast.error(response.error);
      toast.success("Client deleted.");
      router.refresh();
    } catch {
      toast.error("An error occurred while deleting client.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="size-10 mx-auto mb-2 opacity-30" />
        <p>No clients yet. Add your first client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardContent className="flex items-center justify-between py-4">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/clients/${client.id}`)}
            >
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.email}</p>
              {client.phone && (
                <p className="text-xs text-muted-foreground">{client.phone}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {client._count.invoices}
                </p>
                <p className="text-xs text-muted-foreground">invoices</p>
              </div>
              <div className="flex items-center">
                <ClientDialog client={client} />
                <DeleteDialog
                  description="Are you sure you want to delete this client?"
                  isDeleting={isDeleting}
                  handleDelete={handleDelete}
                  id={client.id}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ClientList;
