"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  ArrowLeftToLine,
  ArrowRightFromLine,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SignOutDialog from "@/components/dialog/SignOutDialog";
import ModeToggle from "@/components/ModeToggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ user }: { user: { username: string; email: string } }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
      className={`
        ${isSidebarOpen ? "w-64" : "w-20"}
        transition-all
        group
        sticky top-0
        h-dvh
        shrink-0
        border-r
        px-4 py-6
        flex flex-col justify-between
        duration-200
      `}
    >
      <button
        onClick={() => setIsSidebarOpen((current) => !current)}
        className="
          hidden lg:block
          duration-200 opacity-0 
          group-hover:opacity-100 cursor-pointer 
          absolute -right-4 top-[50%] translate-y-[-50%] 
          rounded-full text-muted-foreground 
          bg-neutral-50 dark:bg-neutral-900 
          p-2 border"
      >
        {isSidebarOpen ? (
          <ArrowLeftToLine className="size-4" />
        ) : (
          <ArrowRightFromLine className="size-4" />
        )}
      </button>

      <div className="space-y-6">
        <div className="flex items-center pl-3">
          <img src="/arrow-logo.png" alt="Wallet Icon" className="size-5" />
          {isSidebarOpen && (
            <h1 className="text-2xl font-bold font-mono px-2">
              <span className="text-indigo-500">In</span>vio
            </h1>
          )}
        </div>

        <nav className="space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 ${isSidebarOpen ? "px-3" : "justify-center"} py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.includes(href)
                  ? "bg-neutral-900/10 text-neutral-900  dark:text-neutral-50 dark:bg-neutral-50/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon className="size-5" />
              {isSidebarOpen && label}
            </Link>
          ))}
        </nav>

        <Separator
          orientation="horizontal"
          className="bg-neutral-300 dark:bg-neutral-700 h-px"
        />

        <Link
          href="/invoices/new"
          className="py-2 text-sm flex items-center justify-center gap-2 bg-2 rounded-lg bg-indigo-500 text-neutral-50 hover:bg-indigo-600 duration-200"
        >
          {isSidebarOpen && "Add invoice"}
          <Plus className="size-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {isSidebarOpen && (
          <div className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <div
          className={`flex ${!isSidebarOpen && "flex-col"} items-center gap-2`}
        >
          <div className={`flex-1 ${!isSidebarOpen && "order-2"}`}>
            <SignOutDialog
              buttonContent={
                <>
                  <LogOut className="size-4" />
                  {isSidebarOpen && <p>Sign Out</p>}
                </>
              }
            />
          </div>
          <ModeToggle size={"default"} />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
