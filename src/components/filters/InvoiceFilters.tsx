"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const STATUSES = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"];

function InvoiceFilters({
  currentStatus,
  currentSearch,
}: {
  currentStatus: string;
  currentSearch: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset page on filter change
      router.push(`/invoices?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams("search", value);
  }, 400);

  const handleClearSearch = () => {
    setSearch("");
    updateParams("search", "");
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by invoice number or client..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUSES.map((status) => (
          <Button
            key={status}
            variant={currentStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams("status", status)}
            className="cursor-pointer"
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default InvoiceFilters;
