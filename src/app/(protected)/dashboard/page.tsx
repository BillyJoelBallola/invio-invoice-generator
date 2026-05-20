import { getDashboardData } from "@/actions/dashboard.action";
import {
  FileText,
  CircleDollarSign,
  TriangleAlert,
  FilePen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentInvoices from "@/components/RecentInvoices";
import RevenueChart from "@/components/RevenueChart";
import StatusChart from "@/components/StatusChart";

export const dynamic = "force-dynamic";

async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) return null;

  const summaryCards = [
    {
      label: "Total Invoices",
      value: data.totalInvoices,
      icon: FileText,
      description: "All invoices",
      color: "text-blue-500",
    },
    {
      label: "Paid",
      value: `₱${data.paid.total.toLocaleString()}`,
      icon: CircleDollarSign,
      description: `${data.paid.count} invoices`,
      color: "text-green-500",
    },
    {
      label: "Overdue",
      value: `₱${data.overdue.total.toLocaleString()}`,
      icon: TriangleAlert,
      description: `${data.overdue.count} invoices`,
      color: "text-red-500",
    },
    {
      label: "Drafts",
      value: data.draft,
      icon: FilePen,
      description: "Unpublished invoices",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className={`size-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={data.monthlyRevenue} />
        <StatusChart data={data.statusBreakdown} />
      </div>

      {/* Recent Invoices */}
      <RecentInvoices invoices={data.recent} />
    </div>
  );
}

export default DashboardPage;
