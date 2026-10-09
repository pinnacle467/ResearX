import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useResearchStore } from "@/store/useResearchStore";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ProjectRow, ProjectRowSkeleton, ROW_COLS } from "@/components/dashboard/ProjectRow";
import { EmptyProjects, NoMatches } from "@/components/dashboard/EmptyState";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import { IN_PROGRESS } from "@/lib/types";

const useDebounced = (value, ms) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
};

export default function Dashboard() {
  const projects = useResearchStore((s) => s.projects);
  const workspace = useResearchStore((s) => s.workspace);
  const hydrated = useResearchStore((s) => s.hydrated);
  const deleteProject = useResearchStore((s) => s.deleteProject);
  const duplicateProject = useResearchStore((s) => s.duplicateProject);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("updated");
  const [toDelete, setToDelete] = useState(null);
  const q = useDebounced(search.trim().toLowerCase(), 180);

  const counts = useMemo(() => ({ all: projects.length, in_progress: projects.filter((p) => IN_PROGRESS.includes(p.status)).length, completed: projects.filter((p) => p.status === "completed").length }), [projects]);

  const visible = useMemo(() => {
    const list = projects.filter((p) => (tab === "all" || (tab === "in_progress" ? IN_PROGRESS.includes(p.status) : p.status === tab)) && (!q || p.title.toLowerCase().includes(q) || p.query.toLowerCase().includes(q)));
    const by = { updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt), title: (a, b) => a.title.localeCompare(b.title), sources: (a, b) => b.sources.length - a.sources.length };
    return [...list].sort(by[sort]);
  }, [projects, tab, q, sort]);

  const onDuplicate = (p) => {
    const copy = duplicateProject(p.id);
    toast.success("Project duplicated", { description: copy.title });
  };
  const confirmDelete = () => {
    deleteProject(toDelete.id);
    toast.success("Project deleted", { description: toDelete.title });
    setToDelete(null);
  };

  return (
    <div className="relative pt-8 space-y-7 page-in" data-testid="dashboard-page">
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs"><span className="gold font-semibold">Workspace</span> · {workspace}</p>
          <h1 className="display mt-2 text-[44px] leading-[0.95] tracking-tight text-[#141a26] sm:text-[52px]">
            Research <em className="scribble"><span className="sunset">notebook</span></em>
          </h1>
        </div>
        <div className="flex items-end gap-2 sm:text-right">
          <span className="doodle-arrow mb-1 hidden -scale-x-100 sm:inline-block" aria-hidden="true" />
          <p className="hand max-w-[260px] -rotate-[1.5deg]">{projects.length} project{projects.length === 1 ? "" : "s"}. Every claim traced back to a <span className="hl">numbered source</span>.</p>
        </div>
      </div>
      <StatsBar projects={projects} />
      <FilterBar search={search} setSearch={setSearch} tab={tab} setTab={setTab} sort={sort} setSort={setSort} counts={counts} />

      {!hydrated ? (
        <ul className="panel cut-b overflow-hidden" data-testid="dashboard-loading">{Array.from({ length: 3 }).map((_, i) => <ProjectRowSkeleton key={i} />)}</ul>
      ) : projects.length === 0 ? (
        <EmptyProjects />
      ) : visible.length === 0 ? (
        <NoMatches onReset={() => { setSearch(""); setTab("all"); }} />
      ) : (
        <div className="panel cut-b overflow-hidden">
          <div className={`hidden md:grid gap-3 border-b-[1.5px] border-dashed border-[#141a26]/30 bg-[#141a26]/[0.04] px-5 py-2 label-xs ${ROW_COLS}`}>
            <span /><span>Project</span><span>Status</span><span>Sources</span><span>Updated</span><span />
          </div>
          <ul data-testid="project-list">
            {visible.map((p, i) => <ProjectRow key={p.id} project={p} index={i} onDelete={setToDelete} onDuplicate={onDuplicate} />)}
          </ul>
        </div>
      )}
      <DeleteDialog project={toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
}
