"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";

export async function getClients() {
  const user = await currentUser();
  if (!user) return null;

  return prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });
}

export async function getClient(id: string) {
  const user = await currentUser();
  if (!user) return null;

  return prisma.client.findFirst({
    where: { id, userId: user.id },
    include: { invoices: true },
  });
}

export async function createClient({
  name,
  email,
  address,
  phone,
}: {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const existing = await prisma.client.findFirst({
      where: { email, userId: user.id },
    });

    if (existing) return { error: "Client with this email already exists." };

    const client = await prisma.client.create({
      data: { name, email, address, phone, userId: user.id },
    });

    return { success: true, client };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while creating client." };
  }
}

export async function updateClient({
  id,
  name,
  email,
  address,
  phone,
}: {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    const client = await prisma.client.update({
      where: { id, userId: user.id },
      data: { name, email, address, phone },
    });

    return { success: true, client };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating client." };
  }
}

export async function deleteClient(id: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    await prisma.client.delete({
      where: { id, userId: user.id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while deleting client." };
  }
}
