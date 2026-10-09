import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileSearch } from "lucide-react";
import { useResearchStore } from "@/store/useResearchStore";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { SourceRegistry } from "@/components/workspace/SourceRegistry";
import { FindingsColumn } from "@/components/workspace/FindingsColumn";
import { AnalystChat } from "@/components/workspace/AnalystChat";

const MOBILE_TABS = [["findings", "Findings"], ["sources", "Sources"], ["chat", "Analyst"]];

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useResearchStore((s) => s.projects.find((p) => p.id === id));
  const hydrated = useResearchStore((s) => s.hydrated);
  const desktop = useIsDesktop();
  const [mobile, setMobile] = useState("findings");

  if (!hydrated) return <div className="pt-6 space-y-3" data-testid="workspace-loading"><div className="skeleton h-8 w-1/2" /><div className="skeleton h-64 w-full" /></div>;
  if (!project) {
    return (
      <div className="panel cut-d tape mt-8 flex flex-col items-start gap-3 px-6 py-10 tilt-l page-in" data-testid="workspace-not-found">
        <FileSearch className="h-5 w-5 text-stone-800" />
        <div>
          <h2 className="display text-[22px] leading-tight">Project not found</h2>
          <p className="mt-1 text-[14px] text-stone-700">It may have been deleted, or the link is out of date.</p>
        </div>
        <button type="button" onClick={() => navigate("/")} className="btn-primary" data-testid="workspace-back-home-btn">Back to dashboard</button>
      </div>
    );
  }

  const sources = <SourceRegistry project={project} />;
  const findings = <FindingsColumn project={project} />;
  const chat = <AnalystChat project={project} />;

  return (
    <div className="pt-4 page-in" data-testid="workspace-page">
      <WorkspaceHeader project={project} />

      {desktop ? (
        <div className="mt-7 grid grid-cols-[280px_minmax(0,1fr)_340px] items-start gap-5">
          <div className="sticky top-[4.5rem] tilt-l settle" style={{ animationDelay: "60ms", "--settle-to": "-0.7deg" }}>{sources}</div>
          <div className="min-w-0 settle" style={{ animationDelay: "120ms" }}>{findings}</div>
          <div className="sticky top-[4.5rem] tilt-r settle" style={{ animationDelay: "180ms", "--settle-to": "0.6deg" }}>{chat}</div>
        </div>
      ) : (
        <div className="mt-7">
          <div className="seg flex w-full" role="tablist">
            {MOBILE_TABS.map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={mobile === k} onClick={() => setMobile(k)} data-testid={`mobile-tab-${k}`} className="seg-item flex-1">{label}</button>
            ))}
          </div>
          <div key={mobile} className="mt-4 tab-in">{mobile === "sources" ? sources : mobile === "chat" ? chat : findings}</div>
        </div>
      )}
    </div>
  );
}
