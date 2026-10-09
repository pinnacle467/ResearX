import { cn } from "@/lib/utils";

const MAP = {
  completed: { label: "Completed", dot: "bg-teal-500", text: "text-teal-900", ring: "bg-teal-500/10" },
  analyzing: { label: "Analyzing", dot: "bg-amber-500 animate-pulse", text: "text-amber-900", ring: "bg-amber-400/10" },
  synthesizing: { label: "Synthesizing", dot: "bg-[#e3b04b] animate-pulse", text: "text-[#7a5410]", ring: "bg-[#e3b04b]/10" },
  queued: { label: "Queued", dot: "bg-indigo-400", text: "text-indigo-900", ring: "bg-indigo-400/10" },
  draft: { label: "Draft", dot: "bg-stone-400", text: "text-stone-700", ring: "bg-stone-400/10" },
  failed: { label: "Failed", dot: "bg-rose-500", text: "text-rose-900", ring: "bg-rose-500/10" },
};

export const StatusBadge = ({ status, className, testId }) => {
  const s = MAP[status] || MAP.draft;
  return (
    <span data-testid={testId} className={cn("chip", s.ring, s.text, className)}>
      <span className={cn("h-[7px] w-[7px] rounded-[50%_40%_60%_45%/45%_55%_40%_60%]", s.dot)} />
      {s.label}
    </span>
  );
};

const SOURCE = {
  queued: { label: "Queued", cls: "text-indigo-800 bg-indigo-100" },
  parsed: { label: "Reading", cls: "text-amber-900 bg-amber-100" },
  extracted: { label: "Extracted", cls: "text-teal-900 bg-teal-100" },
  failed: { label: "Failed", cls: "text-rose-900 bg-rose-100" },
};

export const SourceStatus = ({ status }) => {
  const s = SOURCE[status] || SOURCE.queued;
  return <span className={cn("chip-flat chip-flip", s.cls)}>{s.label}</span>;
};
