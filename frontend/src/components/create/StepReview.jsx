import { ArrowLeft, Loader2, Play } from "lucide-react";
import { DEPTHS, domainOf } from "@/lib/types";

export const StepReview = ({ query, preset, urls, depth, onBack, onLaunch, launching }) => (
  <div className="flex flex-1 flex-col tab-in">
    <div>
      <h2 className="display text-[24px] leading-tight">Review & configure</h2>
      <p className="mt-1 text-[13.5px] text-stone-700">Confirm the brief. The engine starts immediately on launch and runs in the background.</p>
    </div>

    <div className="cut-d mt-4 divide-y divide-dashed divide-[#141a26]/25 border-[1.5px] border-[#141a26]/70 bg-white/50" data-testid="review-summary">
      <div className="px-4 py-3">
        <p className="label-xs">Topic</p>
        <p className="display mt-1 text-[17px] leading-snug text-stone-900" data-testid="review-query">{query}</p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-dashed divide-[#141a26]/25">
        <div className="px-4 py-3"><p className="label-xs">Preset</p><p className="mt-1 text-[14px]" data-testid="review-preset">{preset}</p></div>
        <div className="px-4 py-3"><p className="label-xs">Depth</p><p className="mt-1 text-[14px]" data-testid="review-depth">{DEPTHS[depth].label} <span className="text-stone-800">· {DEPTHS[depth].sources}</span></p></div>
        <div className="px-4 py-3"><p className="label-xs">Input sources</p><p className="mt-1 text-[14px] tabular-nums" data-testid="review-source-count">{urls.length}</p></div>
      </div>
      {urls.length > 0 && (
        <div className="px-4 py-3">
          <p className="label-xs">Seed URLs</p>
          <ul className="mt-1.5 space-y-0.5">{urls.map((u) => <li key={u} className="truncate font-mono text-[12px] text-stone-800">{domainOf(u)} <span className="text-stone-600">{u}</span></li>)}</ul>
        </div>
      )}
    </div>

    <p className="hand-sm mt-4 -rotate-[0.6deg]">Pipeline: Ingesting, then extracting claims, then synthesizing findings. If synthesis times out you can retry from the workspace without re-discovering sources.</p>

    <div className="mt-auto flex justify-between pt-6">
      <button type="button" onClick={onBack} disabled={launching} className="btn-secondary" data-testid="create-research-back-step-btn"><ArrowLeft className="h-3.5 w-3.5" />Back</button>
      <button type="button" onClick={onLaunch} disabled={launching} className="btn-primary" data-testid="start-research-submit-btn">
        {launching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
        Start Research Engine
      </button>
    </div>
  </div>
);
