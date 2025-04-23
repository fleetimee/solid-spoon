import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("py-3.5 px-4 text-sm font-medium", className)}>
        {title}
      </div>
    );
  }

  const SortIcon =
    column.getIsSorted() === "desc"
      ? ArrowDown
      : column.getIsSorted() === "asc"
        ? ArrowUp
        : ArrowUpDown;

  return (
    <div className={cn("flex items-center", className)}>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-4 py-3.5 data-[state=open]:bg-accent -ml-4"
          >
            <span className="mr-2">{title}</span>{" "}
            <SortIcon className="h-4 w-4 text-muted-foreground/70" />{" "}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-4 w-4 text-muted-foreground" /> Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
            Descending
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" /> Hide
                column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
