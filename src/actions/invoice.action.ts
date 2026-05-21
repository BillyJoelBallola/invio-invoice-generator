"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";
import { InvoiceStatus } from "@/generated/prisma";
import { randomBytes } from "crypto";

async function generateInvoiceNumber(userId: string) {
  const count = await prisma.invoice.count({ where: { userId } });
  return `INV-${String(count + 1).padStart(3, "0")}`;
}

export async function getInvoices(options?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const user = await currentUser();
  if (!user) return null;

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const skip = (page - 1) * limit;

  const where = {
    userId: user.id,
    ...(options?.status && options.status !== "ALL"
      ? { status: options.status as InvoiceStatus }
      : {}),
    ...(options?.search
      ? {
          OR: [
            {
              number: {
                contains: options.search,
                mode: "insensitive" as const,
              },
            },
            {
              client: {
                name: {
                  contains: options.search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
      skip,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    invoices,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getInvoice(id: string) {
  const user = await currentUser();
  if (!user) return null;

  return prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: { client: true, items: true },
  });
}

export async function createInvoice({
  clientId,
  dueDate,
  notes,
  tax,
  items,
}: {
  clientId: string;
  dueDate: string;
  notes?: string;
  tax: number;
  items: { description: string; quantity: number; price: number }[];
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const taxAmount = (subtotal * tax) / 100;
    const total = subtotal + taxAmount;
    const number = await generateInvoiceNumber(user.id);

    const invoice = await prisma.invoice.create({
      data: {
        number,
        dueDate: new Date(dueDate),
        notes,
        subtotal,
        tax,
        taxAmount,
        total,
        userId: user.id,
        clientId,
        items: { create: items },
      },
    });

    return { success: true, invoice };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while creating invoice." };
  }
}

export async function updateInvoice({
  id,
  clientId,
  dueDate,
  notes,
  tax,
  items,
}: {
  id: string;
  clientId: string;
  dueDate: string;
  notes?: string;
  tax: number;
  items: { description: string; quantity: number; price: number }[];
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const taxAmount = (subtotal * tax) / 100;
    const total = subtotal + taxAmount;

    // delete old items and recreate
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    const invoice = await prisma.invoice.update({
      where: { id, userId: user.id },
      data: {
        dueDate: new Date(dueDate),
        notes,
        subtotal,
        tax,
        taxAmount,
        total,
        clientId,
        items: {
          create: items.map(({ description, quantity, price }) => ({
            description,
            quantity,
            price,
          })),
        },
      },
    });

    return { success: true, invoice };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating invoice." };
  }
}

export async function updateInvoiceStatus({
  id,
  status,
}: {
  id: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const invoice = await prisma.invoice.update({
      where: { id, userId: user.id },
      data: { status },
    });

    return { success: true, invoice };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating invoice status." };
  }
}

export async function deleteInvoice(id: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await prisma.invoice.delete({ where: { id, userId: user.id } });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while deleting invoice." };
  }
}

export async function markOverdueInvoices() {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const updated = await prisma.invoice.updateMany({
      where: {
        userId: user.id,
        status: "SENT",
        dueDate: { lt: new Date() },
      },
      data: { status: "OVERDUE" },
    });

    return { success: true, count: updated.count };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while marking overdue invoices." };
  }
}

export async function generateShareToken(id: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const token = randomBytes(32).toString("hex");

    await prisma.invoice.update({
      where: { id, userId: user.id },
      data: { shareToken: token },
    });

    return { success: true, token };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while generating share link." };
  }
}

export async function getInvoiceByToken(token: string) {
  return prisma.invoice.findUnique({
    where: { shareToken: token },
    include: { client: true, items: true },
  });
}

export async function revokeShareToken(id: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    await prisma.invoice.update({
      where: { id, userId: user.id },
      data: { shareToken: null },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while revoking share link." };
  }
}
