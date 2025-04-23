"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  OnChangeFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  onSortingChange: OnChangeFn<SortingState>;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pageIndex: number;
  pageSize: number;
  // Add other props needed for toolbar and pagination
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchField: "email" | "name";
  searchOperator: "contains" | "starts_with" | "ends_with";
  onSearchSubmit: (e: React.FormEvent) => void;
  clearSearch: () => void;
  activeFilters: number;
  resetFilters: () => void;
  userRoles: string[];
  joinedAfter: string;
  setJoinedAfter: (date: string) => void;
  joinedBefore: string;
  setJoinedBefore: (date: string) => void;
  applyFilters: () => void;
  isApplyingFilters: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  sorting,
  columnFilters,
  pageIndex,
  pageSize,
  searchValue,
  onSearchChange,
  searchField,
  searchOperator,
  onSearchSubmit,
  clearSearch,
  activeFilters,
  resetFilters,
  userRoles,
  joinedAfter,
  setJoinedAfter,
  joinedBefore,
  setJoinedBefore,
  applyFilters,
  isApplyingFilters,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchField={searchField}
        searchOperator={searchOperator}
        onSearchSubmit={onSearchSubmit}
        clearSearch={clearSearch}
        activeFilters={activeFilters}
        resetFilters={resetFilters}
        userRoles={userRoles}
        joinedAfter={joinedAfter}
        setJoinedAfter={setJoinedAfter}
        joinedBefore={joinedBefore}
        setJoinedBefore={setJoinedBefore}
        applyFilters={applyFilters}
        isApplyingFilters={isApplyingFilters}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
