import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

type CardMobileMenuProps = {
  dropDownMenuContent: React.ReactElement;
};

function CardMobileMenu({ dropDownMenuContent }: CardMobileMenuProps) {
  return (
    <div className="block md:hidden absolute right-2 top-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30" align="end">
          <DropdownMenuGroup>{dropDownMenuContent}</DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default CardMobileMenu;
