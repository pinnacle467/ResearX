import { useState } from "react";
import { FileText, Globe, Plus, Quote } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SourceStatus } from "@/components/StatusBadge";
import { SourceSheet } from "@/components/workspace/SourceSheet";
import { useResearchStore } from "@/store/useResearchStore";
import { isValidUrl } from "@/lib/format";
import { domainOf } from "@/lib/types";

const ICON = { url: Globe, pdf: FileText, text_snippet: Quote };

export const SourceRegistry = ({ project }) => {
  const addSource = useResearchStore((s) => s.addSource);
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(null);
  const inputs = project.sources.filter((s) => s.origin !== "discovered");
  const discovered = project.sources.filter((s) => s.origin === "discovered");
  const extracted = project.sources.filter((s) => s.status === "extracted").length;

  const add = (e) => {
    e.preventDefault();
    const v = url.trim();
    if (!isValidUrl(v)) return toast.error("Enter a full URL including https://");
    if (!addSource(project.id, v)) return toast.error("That source is already in the registry");
    toast.success(`Queued ${domainOf(v)}`);
    setUrl("");
  };

  const Item = ({ s }) => {
    const Icon = ICON[s.type] || Globe;
    const n = project.sources.indexOf(s) + 1;
    return (
      <li>
        <button type="button" onClick={() => setOpen(s)} data-testid={`workspace-source-item-${s.id}`} className="chip-c flex w-full items-start gap-2 px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#2a9d8f]/10">
          <span className={`chip-c mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center font-mono text-[11px] text-white ${n % 2 ? "-rotate-[4deg]" : "rotate-[3deg]"}`} style={{ background: "linear-gradient(135deg, #2a9d8f, #1f7a70)", boxShadow: "1px 1px 0 0 #141a26" }}>{n}</span>
          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6f6a62]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-stone-800">{s.title}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <SourceStatus key={s.status} status={s.status} />
              {s.url && <span className="truncate font-mono text-[11px] text-stone-800">{domainOf(s.url)}</span>}
            </div>
          </div>
        </button>
      </li>
    );
  };

  return (
    <aside className="panel cut-d tape" data-testid="workspace-source-registry">
      <div className="flex items-center justify-between border-b-[1.5px] border-dashed border-[#141a26]/25 px-4 py-2.5 tint-mint" style={{ borderRadius: "9px 16px 0 0 / 14px 19px 0 0" }}>
        <span className="label-xs text-[#1f7a70]">Source registry</span>
        <span className="hand-sm text-[#1f7a70]" data-testid="workspace-source-count">{extracted}/{project.sources.length} extracted</span>
      </div>
      {project.sources.length === 0 ? (
        <p className="hand-sm px-4 py-6" data-testid="workspace-sources-empty">No sources yet. Discovery is queued.</p>
      ) : (
        <Accordion type="multiple" defaultValue={["inputs", "discovered"]} className="px-1 py-1">
          <AccordionItem value="inputs" className="border-b-0">
            <AccordionTrigger className="px-2 py-1.5 text-[13px] font-medium hover:no-underline" data-testid="source-group-inputs">Input sources <span className="ml-auto mr-2 font-mono text-[11px] text-stone-800">{inputs.length}</span></AccordionTrigger>
            <AccordionContent className="pb-1">
              {inputs.length === 0 ? <p className="px-2 py-1 text-[12px] text-stone-800">None provided</p> : <ul className="space-y-px">{inputs.map((s) => <Item key={s.id} s={s} />)}</ul>}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="discovered" className="border-b-0">
            <AccordionTrigger className="px-2 py-1.5 text-[13px] font-medium hover:no-underline" data-testid="source-group-discovered">Discovered <span className="ml-auto mr-2 font-mono text-[11px] text-stone-800">{discovered.length}</span></AccordionTrigger>
            <AccordionContent className="pb-1">
              {discovered.length === 0 ? <p className="px-2 py-1 text-[12px] text-stone-800">{project.status === "completed" ? "No additional sources were discovered" : "Indexing\u2026"}</p> : <ul className="space-y-px">{discovered.map((s) => <Item key={s.id} s={s} />)}</ul>}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <form onSubmit={add} className="flex gap-1.5 border-t-[1.5px] border-dashed border-[#141a26]/25 p-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Add URL mid-session…" className="input h-7 text-[13px]" data-testid="workspace-add-source-input" aria-label="Add source URL" />
        <button type="submit" className="btn-secondary h-7 w-7 shrink-0 p-0" aria-label="Add source" data-testid="workspace-add-source-btn"><Plus className="h-3.5 w-3.5" /></button>
      </form>
      <SourceSheet source={open} index={open ? project.sources.indexOf(open) + 1 : 0} onClose={() => setOpen(null)} />
    </aside>
  );
};
