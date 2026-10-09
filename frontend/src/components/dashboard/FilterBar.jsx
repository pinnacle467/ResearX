import { ArrowUpDown, Search, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const TABS = [["all", "All"], ["in_progress", "In Progress"], ["completed", "Completed"]];
export const SORTS = { updated: "Recently updated", title: "Title (A-Z)", sources: "Most sources" };

export const FilterBar = ({ search, setSearch, tab, setTab, sort, setSort, counts }) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" data-testid="dashboard-filter-bar">
    <div className="seg self-start" role="tablist">
      {TABS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={tab === key}
          data-testid={`dashboard-filter-${key.replace("_", "-")}`}
          onClick={() => setTab(key)}
          className="seg-item"
        >
          {label}
          <span className={`ml-1.5 font-mono text-[11px] ${tab === key ? "text-[#e3b04b]" : "text-[#6f6a62]"}`}>{counts[key]}</span>
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <div className="relative flex-1 md:w-72">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-800" />
        <input data-testid="dashboard-search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles and queries…" className="input pl-8 pr-7" />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="Clear search" data-testid="dashboard-search-clear" className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-800 hover:text-stone-900"><X className="h-3.5 w-3.5" /></button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="btn-secondary shrink-0" data-testid="dashboard-sort-trigger" aria-label="Sort projects">
          <ArrowUpDown className="h-3.5 w-3.5 text-stone-700" />
          <span className="hidden sm:inline">{SORTS[sort]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="paper-pop w-48">
          {Object.entries(SORTS).map(([k, label]) => (
            <DropdownMenuItem key={k} onClick={() => setSort(k)} data-testid={`dashboard-sort-${k}`} className={k === sort ? "font-medium" : ""}>{label}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);
