import { Check, Loader2 } from "lucide-react";

const STEPS = [["Ingesting", "Scraping and indexing sources"], ["Extracting claims", "Parsing and clustering statements"], ["Synthesizing findings", "Writing categorised findings"]];
const SHAPES = ["cut-b -rotate-[0.8deg]", "cut-d rotate-[0.6deg]", "cut-c -rotate-[0.5deg]"];

export const Stepper = ({ project }) => {
  const idx = project.status === "synthesizing" ? 2 : project.progressPercent >= 45 ? 1 : 0;
  return (
    <section className="panel cut-b tape p-4" data-testid="workspace-stepper">
      <div className="flex items-center justify-between">
        <span className="label-xs">Execution status</span>
        <span className="hand-sm inline-flex items-center gap-1 text-[#8a6219]"><Loader2 className="h-3 w-3 animate-spin" />running</span>
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {STEPS.map(([label, sub], i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li key={label} data-testid={`stepper-step-${i + 1}`} data-state={done ? "done" : active ? "active" : "pending"} className={`border-[1.5px] p-3 transition-all duration-300 ${SHAPES[i]} ${active ? "border-[#141a26] bg-[#e3b04b]/15 breathe" : done ? "border-teal-700/50 bg-teal-500/10" : "border-dashed border-[#141a26]/30"}`}>
              <div className="flex items-center gap-2">
                <span className={`chip-c grid h-5 w-5 place-items-center font-mono text-[11px] ${done ? "rotate-[4deg] bg-teal-600 text-white" : active ? "-rotate-[5deg] border-[1.5px] border-[#141a26] bg-[#e3b04b] text-[#141a26]" : "border-[1.5px] border-dashed border-[#141a26]/40 text-[#6f6a62]"}`}>{done ? <Check className="h-3 w-3" /> : i + 1}</span>
                <span className={`text-[13px] font-medium ${done || active ? "text-stone-900" : "text-stone-700"}`}>Step {i + 1} · {label}</span>
              </div>
              <p className="mt-1 text-[12px] text-stone-700">{sub}</p>
            </li>
          );
        })}
      </ol>
      <ul className="cut-c mt-4 max-h-28 space-y-1 overflow-y-auto border-[1.5px] border-dashed border-[#141a26]/25 bg-[#141a26]/[0.04] p-2.5 font-mono text-[12px]" data-testid="workspace-activity-log">
        {(project.logs || []).map((l, i) => (
          <li key={l.t + i} className={`flex gap-2 ${i === 0 ? "text-stone-900" : "text-stone-700"}`}>
            <span className="shrink-0 text-stone-800">{new Date(l.t).toLocaleTimeString([], { hour12: false })}</span>
            <span>{l.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
