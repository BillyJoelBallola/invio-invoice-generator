"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateInvoiceStatus } from "@/actions/invoice.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStatus } from "@/generated/prisma";

const statuses: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE"];

function InvoiceStatusSelect({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (status: string) => {
    setIsLoading(true);
    try {
      const response = await updateInvoiceStatus({
        id: invoiceId,
        status: status as InvoiceStatus,
      });
      if (response.error) return toast.error(response.error);
      toast.success("Status updated.");
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          defaultValue={currentStatus}
          onValueChange={handleChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

export default InvoiceStatusSelect;
