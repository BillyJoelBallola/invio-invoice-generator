"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

function ClientFilters({ currentSearch }: { currentSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.push(`/clients?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParams(value);
  }, 400);

  const handleClear = () => {
    setSearch("");
    updateParams("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
        className="pl-9 pr-9"
      />
      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export default ClientFilters;
