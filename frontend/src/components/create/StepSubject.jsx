import { ArrowRight, Wand2 } from "lucide-react";
import { PRESETS } from "@/lib/types";

const ENHANCERS = [
  ["Add a timeframe", (q) => `${q.replace(/\?$/, "")} between 2024 and 2026?`],
  ["Add a comparison", (q) => `${q.replace(/\?$/, "")}, compared with the leading alternatives?`],
  ["Ask for trade-offs", (q) => `${q.replace(/\?$/, "")}, and what are the cost, risk and performance trade-offs?`],
];

export const StepSubject = ({ query, setQuery, preset, setPreset, canContinue, onNext }) => (
  <div className="flex flex-1 flex-col tab-in">
    <div>
      <h2 className="display text-[24px] leading-tight">Research subject</h2>
      <p className="mt-1 text-[13.5px] text-stone-700">State the decision you need to make, not just the topic. Specific questions produce sharper findings.</p>
    </div>
    <textarea
      data-testid="create-research-topic-input"
      value={query}
      onChange={(e) => setQuery(e.target.value.slice(0, 500))}
      rows={5}
      autoFocus
      placeholder="e.g. Should we migrate our event pipeline from Kafka to a managed streaming service, and what does it cost at 50k events/sec?"
      className="input mt-4 h-auto resize-none py-2.5 text-[14px] leading-relaxed"
    />
    <div className="mt-2 flex items-center justify-between">
      <span className={`hand-sm ${query && !canContinue ? "text-amber-700" : ""}`}>{query && !canContinue ? "Add a few more words of context" : "Min. 12 characters"}</span>
      <span className="font-mono text-[12px] text-stone-800" data-testid="topic-char-count">{query.length}/500</span>
    </div>

    <div className="mt-5">
      <p className="label-xs mb-2 flex items-center gap-1.5"><Wand2 className="h-3 w-3" />Enhance the prompt</p>
      <div className="flex flex-wrap gap-2">
        {ENHANCERS.map(([label, fn], i) => (
          <button key={label} type="button" disabled={!query.trim()} onClick={() => setQuery(fn(query.trim()).slice(0, 500))} data-testid={`prompt-enhancer-${i}`} className={`btn-secondary h-7 px-2.5 text-[13px] ${i % 2 ? "rotate-[0.8deg]" : "-rotate-[0.8deg]"}`}>{label}</button>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <p className="label-xs mb-2">Research preset</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup">
        {["General", ...PRESETS].map((p) => (
          <button key={p} type="button" role="radio" aria-checked={preset === p} onClick={() => setPreset(p)} data-testid={`preset-${p.toLowerCase().replace(/\s/g, "-")}`} className="choice px-3 py-2.5 text-[13px] font-medium">{p}</button>
        ))}
      </div>
    </div>

    <div className="mt-auto flex justify-end pt-6">
      <button type="button" onClick={onNext} disabled={!canContinue} className="btn-primary" data-testid="create-research-next-step-btn">Continue<ArrowRight className="h-3.5 w-3.5" /></button>
    </div>
  </div>
);
