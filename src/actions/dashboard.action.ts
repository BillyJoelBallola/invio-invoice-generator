"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";

export async function getDashboardData() {
  const user = await currentUser();
  if (!user) return null;

  const [totalInvoices, paid, overdue, draft, recent] = await Promise.all([
    prisma.invoice.count({
      where: { userId: user.id },
    }),
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "PAID" },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { userId: user.id, status: "OVERDUE" },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.count({
      where: { userId: user.id, status: "DRAFT" },
    }),
    prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { client: true },
    }),
  ]);

  // 👇 last 6 months revenue data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, "MMM"),
    };
  }).reverse();

  const monthlyRevenue = await Promise.all(
    last6Months.map(async ({ start, end, label }) => {
      const result = await prisma.invoice.aggregate({
        where: {
          userId: user.id,
          status: "PAID",
          createdAt: { gte: start, lte: end },
        },
        _sum: { total: true },
      });

      return {
        month: label,
        revenue: result._sum.total ?? 0,
      };
    }),
  );

  // 👇 status breakdown for pie chart
  const statusBreakdown = await prisma.invoice.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: true,
  });

  return {
    totalInvoices,
    paid: { count: paid._count, total: paid._sum.total ?? 0 },
    overdue: { count: overdue._count, total: overdue._sum.total ?? 0 },
    draft,
    recent,
    monthlyRevenue,
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s._count,
    })),
  };
}
