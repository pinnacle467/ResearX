import { Link, useNavigate } from "react-router-dom";
import { Copy, ExternalLink, FileText, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/StatusBadge";
import { useResearchStore } from "@/store/useResearchStore";
import { relTime } from "@/lib/format";
import { IN_PROGRESS } from "@/lib/types";

export const ROW_COLS = "md:grid-cols-[34px_minmax(0,1fr)_130px_90px_110px_36px]";

export const ProjectRow = ({ project, index = 0, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const retry = useResearchStore((s) => s.retryProject);
  const live = IN_PROGRESS.includes(project.status);
  return (
    <li className={`group relative grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 border-b border-dashed border-[#141a26]/25 px-5 py-3.5 last:border-b-0 transition-colors duration-200 hover:bg-gradient-to-r hover:from-[#e8744f]/[0.08] hover:via-[#e3b04b]/[0.08] hover:to-transparent settle ${ROW_COLS}`} style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }} data-testid={`project-card-${project.id}`}>
      <span className={`hand hand-index hidden md:block text-[20px] text-[#8a6219] ${index % 2 ? "rotate-[4deg]" : "-rotate-[5deg]"}`} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <Link to={`/project/${project.id}`} className="min-w-0 col-span-2 md:col-span-1 focus-visible:outline-none" data-testid={`project-link-${project.id}`}>
        <p className="display truncate text-[18px] leading-tight text-[#141a26] transition-colors duration-150 group-hover:text-[#c2410c]">{project.title}</p>
        <p className="mt-0.5 truncate text-[13px] text-stone-700">{project.status === "failed" && project.error ? <span className="text-red-700">{project.error.code} · {project.error.stage}</span> : project.query}</p>
        {live && (
          <div className="bar-track mt-2 h-1.5 w-full max-w-xs bg-stone-300/70">
            <div className="bar-fill h-full rainbow-bar transition-[width] duration-700" style={{ width: `${project.progressPercent}%` }} />
          </div>
        )}
      </Link>
      <div className="flex items-center gap-2 md:contents">
        <StatusBadge status={project.status} testId={`project-status-badge-${project.id}`} className={index % 2 ? "rotate-[1.5deg]" : ""} />
        <span className="inline-flex items-center gap-1 text-[13px] text-stone-800 tabular-nums" data-testid={`project-source-count-${project.id}`}><FileText className="h-3.5 w-3.5 text-stone-800" />{project.sources.length}</span>
        <span className="hand-sm" data-testid={`project-updated-${project.id}`}>Updated {relTime(project.updatedAt)}</span>
      </div>
      <div className="absolute right-3 top-3 md:static">
        <DropdownMenu>
          <DropdownMenuTrigger className="btn-ghost h-7 w-7 p-0" aria-label="Project actions" data-testid={`project-menu-${project.id}`}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="paper-pop w-44">
            <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)} data-testid={`project-action-view-${project.id}`}><ExternalLink className="h-3.5 w-3.5" />View Workspace</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(project)} data-testid={`project-action-duplicate-${project.id}`}><Copy className="h-3.5 w-3.5" />Duplicate</DropdownMenuItem>
            {project.status === "failed" && <DropdownMenuItem onClick={() => { retry(project.id); toast("Retrying research"); }} data-testid={`project-action-retry-${project.id}`}><RotateCcw className="h-3.5 w-3.5" />Retry run</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(project)} className="text-red-600 focus:text-red-700" data-testid={`project-action-delete-${project.id}`}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
};

export const ProjectRowSkeleton = () => (
  <li className={`grid grid-cols-[1fr_130px_90px_110px_36px] items-center gap-3 border-b border-dashed border-[#141a26]/20 px-4 py-3 last:border-b-0 ${ROW_COLS}`}>
    <div className="skeleton hidden h-5 w-5 md:block" />
    <div className="space-y-2"><div className="skeleton h-3.5 w-1/2" /><div className="skeleton h-3 w-4/5" /></div>
    <div className="skeleton h-5 w-20" /><div className="skeleton h-3 w-8" /><div className="skeleton h-3 w-20" /><div className="skeleton h-6 w-6" />
  </li>
);
