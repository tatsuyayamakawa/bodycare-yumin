import type {
  PageSearchData,
  SearchQueryData,
} from "@/lib/analytics/google-search-console";

export interface SearchConsoleStats {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  topQueries: SearchQueryData[];
  totalQueries: number;
}

export interface SearchConsoleDashboardProps {
  period: "7d" | "30d" | "3m";
  initialStats?: SearchConsoleStats | null;
  initialQueries?: SearchQueryData[];
  initialPages?: PageSearchData[];
}
