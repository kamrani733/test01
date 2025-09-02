"use client";

import { useSearchParams } from "next/navigation";
import type { DataTableData } from "@/core/models/data-table-data";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDictionary } from "./use-dictionary";
export interface FetchParams {
  page: number;
  perPage: number;
  filters: any[];
  sort: any[];
  globalFilter: string | null;
}

interface UseDataTableDataOptions<T> {
  fetchFunction: (params: FetchParams) => Promise<{ data: DataTableData<T> }>;
  queryKey: string;
}

export function useDataTableData<T>({
  fetchFunction,
  queryKey,
}: UseDataTableDataOptions<T>) {
  const { dictionary } = useDictionary();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "10";
  const filters = searchParams.get("filters");
  const sort = searchParams.get("sort");
  const globalFilter = searchParams.get("globalFilter");

  const defaultData: DataTableData<T> = {
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, page, perPage, filters, sort, globalFilter],
    queryFn: async () => {
      try {
        const parsedFilters = filters ? JSON.parse(filters) : [];
        const parsedSort = sort ? JSON.parse(sort) : [];
        const res = await fetchFunction({
          page: Number(page),
          perPage: Number(perPage),
          filters: parsedFilters,
          sort: parsedSort,
          globalFilter,
        });

        return res.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : dictionary.common.error;
        console.error("Error fetching data:", errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },

    staleTime: 1000 * 60 * 2,
    retry: 2,
    placeholderData: keepPreviousData,
  });

  return { data: data ?? defaultData, isLoading, error, refetch };
}
