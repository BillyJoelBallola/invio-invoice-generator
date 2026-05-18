"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";

async function generateInvoiceNumber(userId: string) {
  const count = await prisma.invoice.count({ where: { userId } });
  return `INV-${String(count + 1).padStart(3, "0")}`;
}

export async function getInvoices() {
  const user = await currentUser();
  if (!user) return null;

  return prisma.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });
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
  items,
}: {
  clientId: string;
  dueDate: string;
  notes?: string;
  items: { description: string; quantity: number; price: number }[];
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const number = await generateInvoiceNumber(user.id);

    const invoice = await prisma.invoice.create({
      data: {
        number,
        dueDate: new Date(dueDate),
        notes,
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
  items,
}: {
  id: string;
  clientId: string;
  dueDate: string;
  notes?: string;
  items: { description: string; quantity: number; price: number }[];
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    // delete old items and recreate
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    const invoice = await prisma.invoice.update({
      where: { id, userId: user.id },
      data: {
        dueDate: new Date(dueDate),
        notes,
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
