"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { deleteClient } from "@/actions/client.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ClientDialog from "@/components/dialog/ClientDialog";
import DeleteDialog from "@/components/dialog/DeleteDialog";
import CardMobileMenu from "@/components/CardMenu";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  _count: { invoices: number };
};

function ClientList({
  clients,
  totalPages,
  currentPage,
}: {
  clients: Client[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/clients?${params.toString()}`);
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
        <Card key={client.id} className="relative">
          <CardContent className="flex items-center justify-between py-4">
            {/* mobile card menu */}
            <CardMobileMenu
              dropDownMenuContent={
                <>
                  <ClientDialog client={client} btnText="Edit" />
                  <DeleteDialog
                    description="Are you sure you want to delete this client?"
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                    btnText="Delete"
                    id={client.id}
                  />
                </>
              }
            />

            <div
              className="flex-1 cursor-pointer"
              onClick={() => router.push(`/clients/${client.id}`)}
            >
              <p className="font-semibold">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.email}</p>
              {client.phone && (
                <p className="text-xs text-muted-foreground">{client.phone}</p>
              )}
              <div className="block md:hidden mt-4">
                <p className="text-lg font-semibold">
                  {client._count.invoices}
                </p>
                <p className="text-xs text-muted-foreground">invoices</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-lg font-semibold">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ClientList;
