import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { domainOf } from "@/lib/types";

export const CitationPill = ({ n, source }) => (
  <Popover>
    <PopoverTrigger className="cite-pill" data-testid={`citation-pill-${n}`}>Source {n}</PopoverTrigger>
    <PopoverContent align="start" className="paper-pop w-80 p-3" data-testid={`citation-popover-${n}`}>
      {source ? (
        <>
          <p className="hand-sm text-[#8a6219]">Source {n} · {source.url ? domainOf(source.url) : source.type}</p>
          <p className="mt-1 text-[13px] font-medium leading-snug">{source.title}</p>
          <p className="mt-2 border-l-[3px] border-[#e3b04b] pl-2.5 text-[13px] leading-relaxed text-stone-800" style={{ borderRadius: "2px 0 0 3px" }}>{source.extractedSnippets?.[0] || "No snippet extracted."}</p>
        </>
      ) : <p className="text-[13px] text-stone-700">Source not found.</p>}
    </PopoverContent>
  </Popover>
);

/** Renders "[Source 3]" tokens inside free text as interactive pills. */
export const CitedText = ({ text, sources }) => (
  <>
    {text.split(/(\[Source \d+\])/g).map((part, i) => {
      const m = part.match(/^\[Source (\d+)\]$/);
      return m ? <CitationPill key={i} n={Number(m[1])} source={sources[Number(m[1]) - 1]} /> : <span key={i}>{part}</span>;
    })}
  </>
);
