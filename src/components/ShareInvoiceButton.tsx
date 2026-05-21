"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Link, Copy, Link2Off } from "lucide-react";
import { generateShareToken, revokeShareToken } from "@/actions/invoice.action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function ShareInvoiceButton({
  invoiceId,
  shareToken,
}: {
  invoiceId: string;
  shareToken: string | null;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const shareUrl = shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${shareToken}`
    : null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await generateShareToken(invoiceId);
      if (response.error) return toast.error(response.error);
      toast.success("Share link generated.");
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard.");
  };

  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      const response = await revokeShareToken(invoiceId);
      if (response.error) return toast.error(response.error);
      toast.success("Share link revoked.");
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!shareToken) {
    return (
      <Button variant="outline" onClick={handleGenerate} disabled={isLoading}>
        <Link className="size-4" />
        <span className="hidden md:block">
          {isLoading ? "Generating..." : "Share"}
        </span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleCopy}>
        <Copy className="size-4" />
        <span className="hidden md:block">Copy Link</span>
      </Button>
      <Button
        variant="outline"
        onClick={handleRevoke}
        disabled={isLoading}
        className="text-red-500 hover:text-red-600"
      >
        <Link2Off className="size-4" />
        <span className="hidden md:block">
          {isLoading ? "Revoking..." : "Revoke"}
        </span>
      </Button>
    </div>
  );
}

export default ShareInvoiceButton;
