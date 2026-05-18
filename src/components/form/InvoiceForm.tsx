"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader, Plus, Trash2 } from "lucide-react";
import { createInvoice, updateInvoice } from "@/actions/invoice.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type Client = { id: string; name: string; email: string };
type Item = { description: string; quantity: number; price: number };
type Invoice = {
  id: string;
  clientId: string;
  dueDate: Date;
  notes: string | null;
  items: Item[];
};

function InvoiceForm({
  clients,
  invoice,
}: {
  clients: Client[];
  invoice?: Invoice;
}) {
  const isEditing = !!invoice;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState(invoice?.clientId ?? "");
  const [dueDate, setDueDate] = useState(
    invoice ? format(new Date(invoice.dueDate), "yyyy-MM-dd") : "",
  );
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [items, setItems] = useState<Item[]>(
    invoice?.items ?? [{ description: "", quantity: 1, price: 0 }],
  );

  const addItem = () =>
    setItems((prev) => [...prev, { description: "", quantity: 1, price: 0 }]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  const isDisabled =
    isLoading ||
    clientId === "" ||
    dueDate === "" ||
    items.some((item) => item.description === "" || item.price === 0);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = isEditing
        ? await updateInvoice({
            id: invoice.id,
            clientId,
            dueDate,
            notes,
            items,
          })
        : await createInvoice({ clientId, dueDate, notes, items });

      if (response.error) return toast.error(response.error);
      if (response.success) {
        toast.success(isEditing ? "Invoice updated." : "Invoice created.");
        router.push(`/invoices/${response.invoice.id}`);
      }
    } catch {
      toast.error(
        `An error occurred while ${isEditing ? "updating" : "creating"} invoice.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client & Due Date */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select onValueChange={setClientId} value={clientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} — {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium">
            <span className="col-span-5">Description</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-3 text-center">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <Input
                className="col-span-5"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />
              <Input
                className="col-span-2"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
              />
              <Input
                className="col-span-3"
                type="number"
                min={0}
                placeholder="0.00"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value))
                }
              />
              <div className="col-span-1 text-right text-sm font-mono">
                ₱{(item.quantity * item.price).toLocaleString()}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="col-span-1 hover:bg-red-100 dark:hover:bg-red-900"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex justify-end pt-4 border-t">
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold font-mono">
                ₱{subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isDisabled}
        className="w-full cursor-pointer"
      >
        {isLoading && <Loader className="size-4 animate-spin" />}
        {invoice?.id ? "Edit Invoice" : "Add Invoice"}
      </Button>
    </form>
  );
}

export default InvoiceForm;
