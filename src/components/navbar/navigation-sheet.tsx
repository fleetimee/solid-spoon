import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Drawer</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-0">
        <div className="flex flex-col flex-1 px-4 py-6">
          <div>
            <SheetHeader className="p-0">
              <Logo />
            </SheetHeader>
            <NavMenu orientation="vertical" className="mt-6" />
          </div>

          <div className="mt-auto pt-6 space-y-4 w-full">
            <Button variant="outline" className="w-full sm:w-auto sm:hidden">
              Sign In
            </Button>
            <Button className="w-full xs:w-auto xs:hidden">Get Started</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
