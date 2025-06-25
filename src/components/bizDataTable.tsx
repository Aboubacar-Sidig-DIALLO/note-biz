"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Données enrichies avec plus de détails
// const data: DataProps[] = [
//   {
//     id: "1",
//     clientName: "Ken Johnson",
//     amount: 316,
//     date: "2024-01-15",
//   },
//   {
//     id: "2",
//     clientName: "Abraham Smith",
//     amount: 242,
//     date: "2024-01-14",
//   },
//   {
//     id: "3",
//     clientName: "Monserrat Garcia",
//     amount: 837,
//     date: "2024-01-13",
//   },
//   {
//     id: "4",
//     clientName: "Silas Rodriguez",
//     amount: 874,
//     date: "2024-01-12",
//   },
//   {
//     id: "5",
//     clientName: "Carmella Wilson",
//     amount: 721,
//     date: "2024-01-11",
//   },
//   {
//     id: "6",
//     clientName: "Sarah Davis",
//     amount: 1250,
//     date: "2024-01-10",
//   },
//   {
//     id: "7",
//     clientName: "Mike Thompson",
//     amount: 543,
//     date: "2024-01-09",
//   },
//   {
//     id: "8",
//     clientName: "Lisa Anderson",
//     amount: 892,
//     date: "2024-01-08",
//   },
// ];

type BizDataTableProps = {
  title: string;
  data: DataProps[];
};

type DataProps = {
  id: string;
  clientName: string;
  amount: number;
  date: string;
};

export const columns: ColumnDef<DataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Sélectionner tout'
        className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Sélectionner la ligne'
        className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='h-auto p-0 font-semibold text-foreground hover:bg-transparent hover:text-primary transition-colors'>
          Client
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium text-foreground'>
          {row.getValue("clientName")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className='h-auto p-0 font-semibold text-foreground hover:bg-transparent hover:text-primary transition-colors'>
        Montant
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return (
        <div className='text-start'>
          <div className='font-semibold text-foreground'>{formatted}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return <div className='text-sm text-muted-foreground'>{formatted}</div>;
    },
  },
];

export default function BizDataTable({ title, data }: BizDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const isMobile = useIsMobile();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* En-tête */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>
                Historique des {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Tableau principal */}
        <Card className='border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm'>
          <CardContent className='space-y-4 p-6'>
            {/* Barre de filtres */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <div className='relative flex-1 max-w-sm'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Rechercher par client...'
                  value={
                    (table
                      .getColumn("clientName")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("clientName")
                      ?.setFilterValue(event.target.value)
                  }
                  className='pl-10 bg-white/50 dark:bg-slate-900/50 border-0 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20'
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='gap-2 bg-white/50 dark:bg-slate-900/50 border-0 shadow-sm hover:bg-white/70 dark:hover:bg-slate-900/70'>
                    <Filter className='h-4 w-4' />
                    Colonnes
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='center' className='w-48'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className='capitalize'
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }>
                          {column.id === "clientName"
                            ? "Client"
                            : column.id === "amount"
                            ? "Montant"
                            : column.id === "date"
                            ? "Date"
                            : column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tableau */}
            <div className='rounded-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden'>
              <Table>
                <TableHeader className='bg-slate-50/50 dark:bg-slate-800/50'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className='border-slate-200/50 dark:border-slate-700/50'>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className='font-semibold text-slate-700 dark:text-slate-300'>
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
                        className='border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200'>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={`py-3`}>
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
                        className='h-24 text-center text-muted-foreground'>
                        Aucun résultat trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {!isMobile && (
              <div className='flex items-center justify-between'>
                <div className='text-sm text-muted-foreground'>
                  {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                  {table.getFilteredRowModel().rows.length} ligne(s)
                  sélectionnée(s).
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className='bg-white/50 dark:bg-slate-900/50 border-0 shadow-sm hover:bg-white/70 dark:hover:bg-slate-900/70'>
                    Précédent
                  </Button>
                  <div className='text-sm text-muted-foreground'>
                    Page {table.getState().pagination.pageIndex + 1} sur{" "}
                    {table.getPageCount()}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className='bg-white/50 dark:bg-slate-900/50 border-0 shadow-sm hover:bg-white/70 dark:hover:bg-slate-900/70'>
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
