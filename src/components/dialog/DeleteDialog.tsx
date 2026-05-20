"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteDialogProps = {
  description: string | React.ReactElement;
  isDeleting: boolean;
  handleDelete: (id: string) => Promise<string | number | undefined>;
  id: string;
  btnText?: string;
};

function DeleteDialog({
  description,
  isDeleting,
  handleDelete,
  id,
  btnText,
}: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={btnText ? "default" : "icon"}
          className={`${btnText && "flex items-center justify-baseline pl-3 gap-2 w-full"} hover:bg-neutral-500/20 cursor-pointer`}
        >
          <Trash2 />
          {btnText && <span>{btnText}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => handleDelete(id)}
            disabled={isDeleting}
          >
            {isDeleting && <Loader className="size-4 animate-spin" />} Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
