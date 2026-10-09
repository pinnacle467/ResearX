import { useState } from "react";
import { ArrowLeft, ArrowRight, Link2, Plus, X } from "lucide-react";
import { DEPTHS, domainOf } from "@/lib/types";
import { isValidUrl } from "@/lib/format";

export const StepSources = ({ urls, setUrls, depth, setDepth, onBack, onNext }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const add = () => {
    const v = url.trim();
    if (!isValidUrl(v)) return setError("Enter a full URL including http:// or https://");
    if (urls.includes(v)) return setError("Already in the list");
    if (urls.length >= 10) return setError("Maximum 10 input sources");
    setUrls([...urls, v]);
    setUrl("");
    setError("");
  };

  return (
    <div className="flex flex-1 flex-col tab-in">
      <div>
        <h2 className="display text-[24px] leading-tight">Sources & focus</h2>
        <p className="mt-1 text-[13.5px] text-stone-700">Seed the engine with URLs you trust. It will discover more during analysis.</p>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-800" />
          <input
            data-testid="create-research-source-input"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="https://…"
            className={`input pl-8 ${error ? "!border-red-500" : ""}`}
          />
        </div>
        <button type="button" onClick={add} className="btn-secondary" data-testid="create-research-add-source-btn"><Plus className="h-3.5 w-3.5" />Add URL</button>
      </div>
      {error && <p className="hand-sm mt-2 text-red-700" data-testid="source-url-error">{error}</p>}

      {urls.length === 0 ? (
        <p className="cut-c mt-3 border-[1.5px] border-dashed border-[#141a26]/35 px-3 py-4 text-center hand-sm" data-testid="source-list-empty">No input sources yet (optional). Discovery will still run.</p>
      ) : (
        <ul className="cut-b mt-3 divide-y divide-dashed divide-[#141a26]/25 border-[1.5px] border-[#141a26]/70" data-testid="seed-source-list">
          {urls.map((u, i) => (
            <li key={u} className="flex items-center gap-3 px-3 py-2">
              <span className="hand text-[#8a6219]">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-stone-800">{domainOf(u)}</p>
                <p className="truncate font-mono text-[12px] text-stone-800">{u}</p>
              </div>
              <button type="button" onClick={() => setUrls(urls.filter((x) => x !== u))} aria-label={`Remove ${domainOf(u)}`} data-testid={`remove-source-${i}`} className="btn-ghost h-6 w-6 p-0"><X className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <p className="label-xs mb-2">Research depth</p>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" data-testid="create-research-depth-selector">
          {Object.entries(DEPTHS).map(([k, d]) => (
            <button key={k} type="button" role="radio" aria-checked={depth === k} onClick={() => setDepth(k)} data-testid={`depth-option-${k}`} className="choice p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium">{d.label}</span>
                <span className="font-mono text-[11px] text-stone-800">{d.sources}</span>
              </div>
              <p className="mt-0.5 text-[12px] text-stone-700">{d.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex justify-between pt-6">
        <button type="button" onClick={onBack} className="btn-secondary" data-testid="create-research-back-step-btn"><ArrowLeft className="h-3.5 w-3.5" />Back</button>
        <button type="button" onClick={onNext} className="btn-primary" data-testid="create-research-next-step-btn">Review<ArrowRight className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
};
