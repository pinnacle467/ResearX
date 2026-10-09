import { AlertOctagon, Copy, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useResearchStore } from "@/store/useResearchStore";

export const FailureBanner = ({ project }) => {
  const retry = useResearchStore((s) => s.retryProject);
  const duplicate = useResearchStore((s) => s.duplicateProject);
  const navigate = useNavigate();
  const err = project.error || { stage: "Unknown stage", code: "RUN_FAILED", message: "The run stopped before findings were produced." };
  const extracted = project.sources.filter((s) => s.status === "extracted").length;

  return (
    <section className="panel cut-d tape relative p-6 pop-in tilt-l" data-testid="workspace-failure-banner" style={{ borderColor: "#be123c", boxShadow: "5px 6px 0 -1px rgba(190,18,60,.4), 0 20px 40px -28px rgba(190,18,60,.35)" }}>
      <span className="stamp stamp-in absolute right-5 top-5 text-rose-700" data-testid="failure-stamp">run failed</span>
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
        <div className="min-w-0 flex-1">
          <h3 className="display text-[22px] leading-tight text-stone-900">The engine stopped at <em className="text-red-700">{err.stage.toLowerCase()}</em>.</h3>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-stone-700" data-testid="failure-message">{err.message}</p>
          <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-stone-700">
            <div><dt className="inline">code </dt><dd className="inline text-stone-800">{err.code}</dd></div>
            <div><dt className="inline">progress </dt><dd className="inline text-stone-800">{project.progressPercent}%</dd></div>
            <div><dt className="inline">sources kept </dt><dd className="inline text-stone-800">{extracted}/{project.sources.length}</dd></div>
            <div><dt className="inline">attempt </dt><dd className="inline text-stone-800">#{(project.retryCount || 0) + 1}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => { retry(project.id); toast("Retrying: extracted sources reused"); }} className="btn-primary" data-testid="workspace-retry-btn"><RotateCcw className="h-3.5 w-3.5" />Retry research</button>
            <button type="button" onClick={() => { const c = duplicate(project.id); toast.success("Duplicated", { description: c.title }); navigate(`/project/${c.id}`); }} className="btn-secondary" data-testid="workspace-duplicate-btn"><Copy className="h-3.5 w-3.5" />Duplicate instead</button>
            <span className="hand -rotate-2 text-[#8a6219]">sources are kept, retry is quick</span>
          </div>
        </div>
      </div>
      <ul className="dashed-rule mt-5 max-h-24 space-y-1 overflow-y-auto pt-3 font-mono text-[12px]" data-testid="failure-log">
        {(project.logs || []).slice(0, 5).map((l, i) => (
          <li key={l.t + i} className={`flex gap-2 ${i === 0 ? "text-red-700" : "text-stone-700"}`}><span className="text-stone-800">{new Date(l.t).toLocaleTimeString([], { hour12: false })}</span><span>{l.message}</span></li>
        ))}
      </ul>
    </section>
  );
};
