import { useState, useCallback, useMemo } from 'react';
import type {
  Contact,
  FilterState,
  Category,
  ContactFunction,
  ContactStatus,
  Confidence,
  ResponseStatus,
} from '@/types';
import { DEFAULT_FILTERS as DEFAULT_FILTER_VALUES } from '@/types';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseFiltersReturn {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  applyFilters: (contacts: Contact[]) => Contact[];
  activeFilterCount: number;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_VALUES);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_VALUES);
  }, []);

  const applyFilters = useCallback(
    (contacts: Contact[]): Contact[] => {
      return contacts.filter((c) => {
        // Category filter
        if (filters.category && c.category !== filters.category) return false;

        // Function filter
        if (filters.function && c.function !== filters.function) return false;

        // Company text search (case-insensitive substring)
        if (
          filters.company.trim() &&
          !c.company.toLowerCase().includes(filters.company.toLowerCase().trim())
        ) {
          return false;
        }

        // Status filter
        if (filters.status && c.status !== filters.status) return false;

        // Confidence filter
        if (filters.confidence && c.confidence !== filters.confidence) return false;

        // Response status filter
        if (
          filters.responseStatus &&
          c.responseStatus !== filters.responseStatus
        ) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.function) count++;
    if (filters.company.trim()) count++;
    if (filters.status) count++;
    if (filters.confidence) count++;
    if (filters.responseStatus) count++;
    return count;
  }, [filters]);

  return { filters, setFilter, clearFilters, applyFilters, activeFilterCount };
}

// Re-export type aliases for convenience in components
export type { FilterState, Category, ContactFunction, ContactStatus, Confidence, ResponseStatus };
