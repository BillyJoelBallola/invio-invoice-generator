import { currentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";
import { FileText, Mail, BarChart2, Link, Eye } from "lucide-react";
import SignInDialog from "@/components/dialog/SignInDialog";
import SignUpDialog from "@/components/dialog/SignUpDialog";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";

const features = [
  {
    icon: FileText,
    label: "PDF generation",
    desc: "Download professional invoices as PDF instantly.",
    bg: "bg-indigo-50 dark:bg-indigo-950",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Mail,
    label: "Email delivery",
    desc: "Send invoices directly to clients with one click.",
    bg: "bg-teal-50 dark:bg-teal-950",
    color: "text-teal-700 dark:text-teal-400",
  },
  {
    icon: BarChart2,
    label: "Revenue tracking",
    desc: "Charts and summaries to monitor your income.",
    bg: "bg-amber-50 dark:bg-amber-950",
    color: "text-amber-700 dark:text-amber-400",
  },
  {
    icon: Link,
    label: "Shareable link",
    desc: "Share a public invoice link with any client.",
    bg: "bg-blue-50 dark:bg-blue-950",
    color: "text-blue-700 dark:text-blue-400",
  },
];

const steps = [
  {
    n: "1",
    title: "Add your clients",
    desc: "Save client details once — name, email, address, and phone.",
  },
  {
    n: "2",
    title: "Create an invoice",
    desc: "Add line items, set a due date, apply tax — totals calculate automatically.",
  },
  {
    n: "3",
    title: "Send and get paid",
    desc: "Send via email with PDF attached, or share a public link.",
  },
  {
    n: "4",
    title: "Track your revenue",
    desc: "Monitor paid, overdue, and draft invoices from your dashboard.",
  },
];

const recentInvoices = [
  {
    client: "Pacific Retail Solutions Inc.",
    number: "INV-1024",
    amount: "₱125,000",
    due: "Jun 20",
    status: "PAID",
  },
  {
    client: "Vertex Construction Group",
    number: "INV-1023",
    amount: "₱87,500",
    due: "Jun 5",
    status: "OVERDUE",
  },
  {
    client: "Apex Logistics Corporation",
    number: "INV-1022",
    amount: "₱54,200",
    due: "Jul 1",
    status: "SENT",
  },
];

const statusStyle: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  DRAFT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(45deg, transparent 49%, #7373734f 49%, #7373734f 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #7373734f 49%, #7373734f 51%, transparent 51%)
      `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 10%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 10%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mt-10">
        {/* Navbar */}
        <nav className="fixed bg-neutral-50 dark:bg-neutral-900 top-0 w-full border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/arrow-logo.png" alt="Wallet Icon" className="size-4" />
            <h1 className="text-xl font-bold font-mono px-2">
              <span className="text-indigo-500">In</span>vio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SignInDialog />
            <SignUpDialog />
            <ModeToggle />
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
          {/* Hero */}
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full">
              <FileText className="size-3" />
              Professional invoicing made simple
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Create invoices in seconds.{" "}
              <span className="text-indigo-500">Get paid faster.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Invio helps freelancers and small businesses create, send, and
              track professional invoices — with PDF generation and email
              delivery built in.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" className="rounded-md">
                <Eye className="size-4" />
                See a sample invoice
              </Button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="border rounded-xl overflow-hidden bg-white dark:bg-neutral-950">
            <div className="flex items-center justify-between px-4 py-2.5 border-b bg-neutral-100 dark:bg-neutral-900">
              <span className="text-sm font-medium font-mono">
                <span className="text-indigo-500">In</span>vio
              </span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
              {[
                { label: "Total invoices", value: "24", color: "" },
                {
                  label: "Paid",
                  value: "₱48,200",
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  label: "Overdue",
                  value: "₱8,500",
                  color: "text-red-600 dark:text-red-400",
                },
                { label: "Drafts", value: "3", color: "" },
              ].map((card) => (
                <div key={card.label} className="p-4 border-b">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {card.label}
                  </p>
                  <p
                    className={`text-lg md:text-2xl font-semibold font-mono ${card.color}`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Invoice list */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Recent invoices
              </p>
              <div className="grid grid-cols-[1fr_80px_72px] md:grid-cols-[1fr_80px_80px_72px] gap-2 pb-2 border-b text-xs text-muted-foreground uppercase tracking-wide">
                <span>Client</span>
                <span className="text-right">Amount</span>
                <span className="hidden md:block text-center">Due</span>
                <span className="text-center">Status</span>
              </div>
              {recentInvoices.map((inv) => (
                <div
                  key={inv.number}
                  className="grid grid-cols-[1fr_80px_72px] md:grid-cols-[1fr_80px_80px_72px] gap-2 py-2.5 border-b last:border-0 items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{inv.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.number}
                    </p>
                  </div>
                  <span className="text-sm font-mono text-right">
                    {inv.amount}
                  </span>
                  <span
                    className={`hidden md:block text-xs text-center ${inv.status === "OVERDUE" ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {inv.due}
                  </span>
                  <span className="flex justify-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {features.map(({ icon: Icon, label, desc, bg, color }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-4 border rounded-xl bg-background"
              >
                <div
                  className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}
                >
                  <Icon className={`size-4 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="border rounded-xl p-6">
            <p className="text-sm font-medium mb-4">How it works</p>
            <div className="space-y-0 divide-y">
              {steps.map((step) => (
                <div key={step.n} className="flex items-start gap-4 py-4">
                  <div className="size-7 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xs font-medium text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-10 px-6 rounded-xl bg-neutral-50 dark:bg-neutral-900 border space-y-4">
            <p className="text-2xl font-semibold">Ready to get paid faster?</p>
            <p className="text-sm text-muted-foreground">
              Free to use. No credit card required.
            </p>
            <SignUpDialog />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Design & Built by Billy Joel © {new Date().getFullYear()} Invio. All
            rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
