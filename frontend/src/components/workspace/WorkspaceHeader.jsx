import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Download, Pencil } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/StatusBadge";
import { useResearchStore } from "@/store/useResearchStore";
import { download, projectToMarkdown } from "@/lib/format";
import { DEPTHS } from "@/lib/types";

export const WorkspaceHeader = ({ project }) => {
  const rename = useResearchStore((s) => s.renameProject);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(project.title);
  const ref = useRef(null);
  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft.trim() !== project.title) {
      rename(project.id, draft);
      toast.success("Title updated");
    } else setDraft(project.title);
  };

  const exportAs = (kind) => {
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (kind === "md") download(`${slug}.md`, projectToMarkdown(project), "text/markdown");
    else download(`${slug}.json`, JSON.stringify(project, null, 2), "application/json");
    toast.success(`Exported as ${kind === "md" ? "Markdown" : "JSON"}`);
  };

  return (
    <div className="panel-ink torn px-5 py-4" data-testid="workspace-header">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link to="/" className="btn h-7 px-2 -ml-2 text-white/90 hover:bg-white/10 hover:text-white" data-testid="workspace-back-link"><ArrowLeft className="h-3.5 w-3.5" />Dashboard</Link>
        <span className="hidden h-4 w-px rotate-[22deg] bg-white/30 sm:block" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 items-center gap-3 basis-full sm:basis-auto">
          {editing ? (
            <input ref={ref} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(project.title); setEditing(false); } }} className="input h-8 max-w-md text-[15px] font-medium" data-testid="workspace-title-input" aria-label="Project title" />
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="group flex min-w-0 items-center gap-1.5 text-left" data-testid="workspace-title" title="Click to rename">
              <h1 className="display truncate text-[26px] leading-none tracking-tight text-[#f6f1e4]">{project.title}</h1>
              <Pencil className="h-3 w-3 shrink-0 text-[#e3b04b] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            </button>
          )}
          <StatusBadge status={project.status} testId="workspace-status-pill" className="border-[#f6f1e4]/70 bg-white/10 text-[#f3eee3] rotate-[2deg]" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hand hidden text-[#f3d78f] md:inline">{DEPTHS[project.depth]?.label} · {project.sources.length} src</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn chip-b press h-8 border-[1.5px] border-[#f6f1e4]/50 bg-white/5 text-[#f3eee3] hover:bg-white/10 hover:border-[#e3b04b]" data-testid="workspace-export-trigger" disabled={project.status !== "completed"}>
              <Download className="h-3.5 w-3.5" />Export
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="paper-pop w-44">
              <DropdownMenuItem onClick={() => exportAs("md")} data-testid="export-markdown">Markdown (.md)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAs("json")} data-testid="export-json">JSON (.json)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="bar-track h-2 flex-1 bg-white/15" role="progressbar" aria-valuenow={project.progressPercent} aria-valuemin={0} aria-valuemax={100} data-testid="workspace-progress-bar">
          <div className={`bar-fill relative h-full overflow-hidden transition-[width] duration-700 ease-out ${project.status === "failed" ? "bg-rose-400" : "rainbow-bar"}`} style={{ width: `${project.progressPercent}%` }}>{project.status !== "completed" && project.status !== "failed" && <span className="shimmer absolute inset-0" />}</div>
        </div>
        <span className="font-mono text-[12px] tabular-nums text-white/85 inline-flex items-center gap-1" data-testid="workspace-progress-value">
          {project.status === "completed" && <Check className="h-3 w-3 text-[#e3b04b]" />}{project.progressPercent}%
        </span>
      </div>
      <p className="mt-2.5 text-[13.5px] text-white/85 line-clamp-2" data-testid="workspace-query">{project.query}</p>
    </div>
  );
};
