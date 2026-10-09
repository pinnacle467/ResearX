import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stepper } from "@/components/workspace/Stepper";
import { FailureBanner } from "@/components/workspace/FailureBanner";
import { CitationPill } from "@/components/workspace/CitationPill";
import { CATEGORIES, IN_PROGRESS } from "@/lib/types";

const CONF = { High: "text-teal-900 bg-teal-100 border-teal-800/60", Medium: "text-amber-900 bg-amber-100 border-amber-800/60", Low: "text-stone-800 bg-stone-100 border-stone-500/60" };
const CAT_COLOR = { "Market Trend": "text-amber-700", "Technical Insight": "text-sky-800", "Risk Factor": "text-red-700", "Competitive Edge": "text-teal-700" };
const CAT_BORDER = { "Market Trend": "border-l-amber-500", "Technical Insight": "border-l-sky-600", "Risk Factor": "border-l-red-600", "Competitive Edge": "border-l-teal-600" };
const CAT_TINT = { "Market Trend": "tint-lemon", "Technical Insight": "tint-sky", "Risk Factor": "tint-rose", "Competitive Edge": "tint-mint" };
const PRIORITY = ["P0", "P1", "P2", "P2", "P3"];
const CARD_SHAPES = ["cut-b tilt-l tape", "cut-d tilt-r tape tape-right", "cut-c tilt-l", "cut-a tilt-r tape"];

const Skeleton = () => (
  <div className="panel cut-d p-4 space-y-3" data-testid="findings-skeleton">
    <div className="skeleton h-3 w-24" />
    <div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-11/12" /><div className="skeleton h-4 w-3/4" />
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{[0, 1].map((i) => <div key={i} className="skeleton h-20" />)}</div>
  </div>
);

export const FindingsColumn = ({ project }) => {
  const live = IN_PROGRESS.includes(project.status);
  const n = (id) => project.sources.findIndex((s) => s.id === id) + 1;

  if (live) return <div className="space-y-5">{<Stepper project={project} />}<Skeleton /></div>;
  if (project.status === "failed") return <FailureBanner project={project} />;

  return (
    <Tabs defaultValue="summary" className="panel cut-c" data-testid="workspace-findings-section">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-none border-b-[1.5px] border-dashed border-[#141a26]/25 bg-transparent p-2">
        {[["summary", "Executive Summary"], ["findings", "Categorized Findings"], ["citations", "Raw Citations"]].map(([k, label]) => (
          <TabsTrigger key={k} value={k} data-testid={`findings-tab-${k}`} className="tab-ink px-3 py-1.5 text-[13px] font-medium">{label}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="summary" className="m-0 p-4 sm:p-5 tab-in" data-testid="tab-summary">
        <p className="label-xs">Synthesis</p>
        <p className="display mt-2 text-[21px] leading-snug text-[#141a26]" data-testid="workspace-summary-text">{project.summary}</p>
        <div className="mt-7 flex items-center gap-3">
          <p className="label-xs">Key takeaways</p>
          <span className="hand-sm -rotate-2 text-[#8a6219]">in priority order</span>
        </div>
        <ul className="cut-b mt-2 divide-y divide-dashed divide-[#141a26]/25 border-[1.5px] border-[#141a26]/70 bg-white/50" data-testid="workspace-key-takeaways-list">
          {project.takeaways.map((t, i) => (
            <li key={t.id} className="flex gap-3 px-3 py-3 settle" style={{ animationDelay: `${i * 70}ms` }} data-testid={`takeaway-item-${i}`}>
              <span className={`chip-flat mt-0.5 h-fit border border-[#141a26] text-white ${i % 2 ? "rotate-[3deg]" : "-rotate-[4deg]"}`} style={{ background: ["linear-gradient(135deg, #e8744f, #c2410c)", "linear-gradient(135deg, #e3b04b, #9a6b1c)", "linear-gradient(135deg, #2a9d8f, #1f7a70)"][i] || "#4f4a42", boxShadow: "1.5px 1.5px 0 0 #141a26" }}>{PRIORITY[i] || "P3"}</span>
              <div>
                <p className="text-[14px] font-medium text-stone-900"><span className={i === 0 ? "hl" : ""}>{t.point}</span></p>
                <p className="mt-0.5 text-[13px] text-stone-700">{t.implication}</p>
              </div>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="findings" className="m-0 p-4 sm:p-5 space-y-7 tab-in" data-testid="tab-findings">
        {CATEGORIES.map((cat, ci) => {
          const items = project.findings.filter((f) => f.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} data-testid={`finding-group-${cat.toLowerCase().replace(/\s/g, "-")}`}>
              <p className="flex items-center gap-3"><span className={`stamp ${CAT_COLOR[cat]} ${ci % 2 ? "!rotate-[1.5deg]" : ""}`}>{cat}</span><span className="hand-sm text-stone-700">x{items.length}</span></p>
              <div className="mt-4 space-y-4">
                {items.map((f, fi) => (
                  <article key={f.id} className={`panel panel-hover border-l-[4px] p-4 settle ${CAT_BORDER[cat]} ${CAT_TINT[cat]} ${CARD_SHAPES[(ci + fi) % CARD_SHAPES.length]}`} style={{ animationDelay: `${(ci * 2 + fi) * 60}ms`, "--settle-to": (ci + fi) % 2 ? "0.6deg" : "-0.7deg" }} data-testid={`finding-card-${f.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="display text-[17px] leading-snug text-stone-900">{f.headline}</h3>
                      <span className={`chip-flat shrink-0 border ${CONF[f.confidence]} ${fi % 2 ? "!rotate-[2deg]" : ""}`}>{f.confidence}</span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-stone-700">{f.detail}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1">
                      {f.sourceIds.map((id) => <CitationPill key={id} n={n(id)} source={project.sources[n(id) - 1]} />)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </TabsContent>

      <TabsContent value="citations" className="m-0 p-4 sm:p-5 tab-in" data-testid="tab-citations">
        <p className="label-xs">Referenced sources</p>
        <ol className="cut-d mt-2 divide-y divide-dashed divide-[#141a26]/25 border-[1.5px] border-[#141a26]/60 bg-white/50">
          {project.sources.map((s, i) => (
            <li key={s.id} className="px-3 py-3" data-testid={`citation-row-${i + 1}`}>
              <div className="flex items-start gap-3">
                <span className={`hand mt-0.5 text-[#8a6219] ${i % 2 ? "rotate-[4deg]" : "-rotate-[5deg]"}`}>[{i + 1}]</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{s.title}</p>
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="block truncate font-mono text-[12px] text-stone-700 underline-offset-2 hover:underline">{s.url}</a>}
                  {s.extractedSnippets?.length > 0 && <ul className="mt-2 space-y-1.5">{s.extractedSnippets.map((x, k) => <li key={k} className="border-l-[3px] border-[#e3b04b] pl-2.5 text-[13px] leading-relaxed text-stone-800" style={{ borderRadius: "2px 0 0 3px" }}>“{x}”</li>)}</ul>}
                  <p className="hand-sm mt-2">Used in {project.findings.filter((f) => f.sourceIds.includes(s.id)).length} finding(s)</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </TabsContent>
    </Tabs>
  );
};
