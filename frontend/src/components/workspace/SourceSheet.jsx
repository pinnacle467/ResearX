import { ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SourceStatus } from "@/components/StatusBadge";
import { domainOf } from "@/lib/types";

const PHRASES = ["cost structure", "adoption rate", "benchmark methodology", "regulatory exposure", "unit economics", "scaling behaviour"];

export const SourceSheet = ({ source, index, onClose }) => (
  <Sheet open={!!source} onOpenChange={(o) => !o && onClose()}>
    <SheetContent className="w-full overflow-y-auto border-l-[1.5px] border-[#141a26] bg-[#fffdf8] sm:max-w-md" data-testid="source-detail-sheet">
      {source && (
        <>
          <SheetHeader className="text-left">
            <p className="hand text-[#8a6219]">Source {index}</p>
            <SheetTitle className="display text-[22px] leading-snug">{source.title}</SheetTitle>
            <SheetDescription className="text-[13px]">
              {source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-stone-800 underline underline-offset-2 hover:text-stone-900" data-testid="source-sheet-link">{domainOf(source.url)}<ExternalLink className="h-3 w-3" /></a> : source.type}
            </SheetDescription>
          </SheetHeader>
          <dl className="cut-b mt-5 grid grid-cols-3 divide-x divide-dashed divide-[#141a26]/25 border-[1.5px] border-[#141a26]/70 text-center">
            <div className="px-2 py-2.5"><dt className="label-xs">Status</dt><dd className="mt-1"><SourceStatus status={source.status} /></dd></div>
            <div className="px-2 py-2.5"><dt className="label-xs">Trust rank</dt><dd className="mt-1 font-mono text-[14px]" data-testid="source-sheet-trust">{source.trustRank || "n/a"}</dd></div>
            <div className="px-2 py-2.5"><dt className="label-xs">Relevance</dt><dd className="mt-1 font-mono text-[14px] tabular-nums" data-testid="source-sheet-relevance">{source.relevanceScore ?? "n/a"}</dd></div>
          </dl>
          <div className="mt-5">
            <p className="label-xs">Key phrases</p>
            <div className="mt-2 flex flex-wrap gap-2">{PHRASES.slice(0, 3 + (index % 3)).map((p, i) => <span key={p} className={`chip-flat border border-[#141a26]/60 bg-[#e3b04b]/15 px-2 py-0.5 font-sans text-[12px] text-stone-800 ${i % 2 ? "!rotate-[1.5deg]" : ""}`}>{p}</span>)}</div>
          </div>
          <div className="mt-5">
            <p className="label-xs">Extracted snippets <span className="font-mono normal-case tracking-normal text-stone-800">({source.extractedSnippetCount || 0})</span></p>
            {source.extractedSnippets?.length ? (
              <ul className="mt-2 space-y-2">{source.extractedSnippets.map((s, i) => <li key={i} className="border-l-[3px] border-[#e3b04b] pl-3 text-[13px] leading-relaxed text-stone-700" style={{ borderRadius: "2px 0 0 3px" }}>{s}</li>)}</ul>
            ) : (
              <p className="hand-sm mt-2">{source.status === "queued" ? "Waiting for extraction." : "Extraction in progress\u2026"}</p>
            )}
          </div>
        </>
      )}
    </SheetContent>
  </Sheet>
);
