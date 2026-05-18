"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";

export async function getDashboardData() {
  const user = await currentUser();
  if (!user) return null;

  const [totalInvoices, paid, overdue, draft, recent] = await Promise.all([
    // total invoices
    prisma.invoice.count({
      where: { userId: user.id },
    }),

    // paid invoices total amount
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "PAID" },
      _sum: { total: true },
      _count: true,
    }),

    // overdue invoices
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "OVERDUE" },
      _sum: { total: true },
      _count: true,
    }),

    // draft invoices
    prisma.invoice.count({
      where: { userId: user.id, status: "DRAFT" },
    }),

    // recent 5 invoices
    prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  return {
    totalInvoices,
    paid: {
      count: paid._count,
      total: paid._sum.total ?? 0,
    },
    overdue: {
      count: overdue._count,
      total: overdue._sum.total ?? 0,
    },
    draft,
    recent,
  };
}
