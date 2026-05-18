"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader, Pencil, Plus } from "lucide-react";
import { createClient, updateClient } from "@/actions/client.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import InputWithLabel from "@/components/input/InputWithLabel";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

function ClientDialog({ client }: { client?: Client }) {
  const isEditing = !!client;

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
  });

  const isDisabled = isLoading || formData.name === "" || formData.email === "";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = isEditing
        ? await updateClient({ id: client.id, ...formData })
        : await createClient(formData);

      if (response.error) return toast.error(response.error);

      if (response.success) {
        toast.success(isEditing ? "Client updated." : "Client added.");
        setIsOpen(false);
        if (!isEditing) {
          setFormData({ name: "", email: "", phone: "", address: "" });
        }
        router.refresh();
      }
    } catch {
      toast.error(
        `An error occurred while ${isEditing ? "updating" : "adding"} client.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button className="cursor-pointer">
            <Plus className="size-4" />
            Add Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Client" : "Add Client"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update client information."
              : "Add a new client to your account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithLabel
            id="name"
            label="Name"
            placeholder="Enter client name"
            value={formData.name}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value as string }))
            }
          />
          <InputWithLabel
            id="email"
            label="Email"
            placeholder="Enter client email"
            value={formData.email}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, email: value as string }))
            }
          />
          <InputWithLabel
            id="phone"
            label="Phone"
            placeholder="Enter client phone"
            value={formData.phone}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, phone: value as string }))
            }
          />
          <InputWithLabel
            id="address"
            label="Address"
            placeholder="Enter client address"
            value={formData.address}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, address: value as string }))
            }
          />
          <Button type="submit" disabled={isDisabled} className="w-full">
            {isLoading && <Loader className="size-4 animate-spin" />}
            {client?.id ? "Edit Client" : "Add Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ClientDialog;
