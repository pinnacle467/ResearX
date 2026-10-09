import { Link, useLocation } from "react-router-dom";
import { ChevronsUpDown, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useResearchStore } from "@/store/useResearchStore";
import { toast } from "sonner";

const WORKSPACES = ["Personal", "Strategy Team", "Platform Engineering"];

export const Header = () => {
  const { pathname } = useLocation();
  const workspace = useResearchStore((s) => s.workspace);
  const setWorkspace = useResearchStore((s) => s.setWorkspace);
  return (
    <header className="sticky top-0 z-40 h-14 border-b-[1.5px] border-[#0b0f17] text-[#f3eee3]" style={{ background: "radial-gradient(ellipse 30% 100% at 85% 0%, rgba(232,116,79,.2), transparent 70%), radial-gradient(ellipse 25% 100% at 20% 100%, rgba(79,70,229,.2), transparent 70%), linear-gradient(180deg, #141a26, #0f1420)", boxShadow: "0 4px 0 -1px rgba(227,176,75,.55), 0 10px 30px -18px rgba(14,19,29,.8)" }} data-testid="app-header">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" data-testid="brand-link">
            <span className="chip-b wiggle-hover grid h-7 w-7 -rotate-6 place-items-center border-[1.5px] border-[#f6f1e4]/80 font-mono text-[11px] font-semibold text-white" style={{ background: "linear-gradient(135deg, #e8744f, #e3b04b 55%, #2a9d8f)", boxShadow: "2px 2px 0 0 rgba(246,241,228,.35)" }}>Rx</span>
            <span className="display text-[20px] leading-none tracking-tight text-[#f6f1e4]">Researx</span>
          </Link>
          <span className="hidden h-5 w-px rotate-[22deg] bg-white/35 sm:block" aria-hidden="true" />
          <DropdownMenu>
            <DropdownMenuTrigger className="btn h-7 min-w-0 max-w-[150px] gap-1 px-2 text-[14px] text-white/90 hover:bg-white/10 hover:text-white sm:max-w-[280px]" data-testid="workspace-selector">
              <span className="min-w-0 truncate">{workspace}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-white/70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="paper-pop w-52">
              {WORKSPACES.map((w) => (
                <DropdownMenuItem key={w} data-testid={`workspace-option-${w.toLowerCase().replace(/\s/g, "-")}`} onClick={() => { setWorkspace(w); toast(`Switched to ${w}`); }} className={w === workspace ? "font-medium" : ""}>
                  {w}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {pathname !== "/create" && (
          <Link to="/create" className="btn-sticker shrink-0 px-2.5 sm:px-3.5" aria-label="New Project" data-testid="new-project-button">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        )}
      </div>
    </header>
  );
};
