"use client";
import { ColumnDef, getExpandedRowModel } from "@tanstack/react-table";
import { useDataTable } from "@/core/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableData } from "@/core/models/data-table-data";
import { RowData } from "@/core/models/row-data";
import { useState } from "react";
import {
  DataTableActionBar,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import DataTableActionDelete from "@/components/data-table/data-table-action-delete";
import ContainerView from "../ContainerView";
import { DataTableGlobalSearch } from "@/components/data-table/data-table-global-search";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface MainDataTableProps<TData extends RowData, TValue> {
  data: DataTableData<TData>;
  columns: ColumnDef<TData, TValue>[];
  onSuccess?: () => void;
  action?: (
    ids: number[]
  ) => Promise<{ status: string; message: string; data: { ids: number[] } }>;
  queryKey?: string[];
  isLoading?: boolean;
}

export function MainDataTable<TData extends RowData, TValue>({
  data,
  columns,
  onSuccess,
  action,
  queryKey,
  isLoading = false,
}: MainDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const { table, shallow, debounceMs, throttleMs } = useDataTable<TData>({
    data: data.data,
    columns,
    pageCount: Math.ceil((data.total ?? 1) / (data.per_page ?? 10)),
    initialState: {
      pagination: {
        pageIndex: (data.current_page ?? 1) - 1,
        pageSize: data.per_page ?? data.data.length,
      },
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => String(row.id),
    getSubRows: (row: TData) =>
      Array.isArray(row.children) ? (row.children as TData[]) : undefined,
    getExpandedRowModel: getExpandedRowModel(),
    meta: { onSuccess },
    clearOnDefault: true, // Clear toolbar state by default
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id as number);

  return (
    <ContainerView>
      {isLoading ? (
        <div className="flex w-full flex-col gap-2.5 overflow-auto">
          <DataTableAdvancedToolbar table={table}>
            <DataTableGlobalSearch table={table} debounceMs={1000} />
            <DataTableFilterList
              table={table}
              align="start"
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
            <DataTableSortList table={table} align="start" />
            <DataTableActionBar table={table}>
              <DataTableActionBarSelection table={table} />
              <DataTableActionDelete
                ids={selectedIds}
                action={action!}
                onSuccess={onSuccess}
                queryKey={queryKey || []}
              />
            </DataTableActionBar>
          </DataTableAdvancedToolbar>

          <DataTableSkeleton
            columnCount={columns.length}
            rowCount={15}
            filterCount={0}
            withViewOptions={false}
            withPagination={true}
          />
        </div>
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableGlobalSearch table={table} debounceMs={700} />
            <DataTableFilterList
              table={table}
              align="start"
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
            <DataTableSortList table={table} align="start" />
            <DataTableActionBar table={table}>
              <DataTableActionBarSelection table={table} />
              <DataTableActionDelete
                ids={selectedIds}
                action={action!}
                onSuccess={onSuccess}
                queryKey={queryKey || []}
              />
            </DataTableActionBar>
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </ContainerView>
  );
}
