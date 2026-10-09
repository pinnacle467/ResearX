import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot } from "lucide-react";
import { useResearchStore } from "@/store/useResearchStore";
import { CitedText } from "@/components/workspace/CitationPill";
import { IN_PROGRESS } from "@/lib/types";

const QUICK = ["What are the major risks?", "Summarize for C-level", "Compare to 2024 data"];

export const AnalystChat = ({ project }) => {
  const sendMessage = useResearchStore((s) => s.sendMessage);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const ready = project.status === "completed";
  const streaming = project.messages.some((m) => m.streaming);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [project.messages]);

  const ask = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    await sendMessage(project.id, q);
    setBusy(false);
  };

  return (
    <aside className="panel cut-b tape tape-right flex flex-col lg:h-[calc(100vh-6.5rem)] min-h-[420px]" data-testid="workspace-analyst-chat">
      <div className="flex items-center justify-between border-b-[1.5px] border-dashed border-[#141a26]/25 px-4 py-2.5 tint-lavender" style={{ borderRadius: "7px 19px 0 0 / 17px 9px 0 0" }}>
        <span className="label-xs text-indigo-700">Analyst chat</span>
        <span className="hand-sm text-indigo-700">{project.messages.length} msgs</span>
      </div>
      <div className="flex-1 space-y-3.5 overflow-y-auto p-3" data-testid="chat-message-list">
        {!ready ? (
          <div className="flex h-full flex-col items-start justify-center gap-2 text-[13px] text-stone-800" data-testid="chat-locked">
            <Bot className="h-4 w-4" />
            {IN_PROGRESS.includes(project.status) ? "The analyst joins once findings are synthesized." : "The run failed before findings existed. Retry it to bring the analyst in."}
          </div>
        ) : (
          <>
            {project.messages.map((m, i) => (
              <div key={m.id} className={`flex pop-in ${m.sender === "user" ? "justify-end origin-bottom-right" : "justify-start origin-bottom-left"}`} data-testid={`chat-message-${m.sender}`}>
                <div className={`max-w-[88%] px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "text-white rounded-[16px_5px_14px_16px/12px_16px_6px_14px]" : "border-[1.5px] border-[#141a26]/70 tint-lavender text-[#141a26] rounded-[5px_16px_16px_14px/16px_12px_14px_6px]"} ${i % 2 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"} ${m.streaming ? "caret" : ""}`} style={m.sender === "user" ? { background: "linear-gradient(160deg, #4f46e5, #3730a3)", boxShadow: "3px 3px 0 0 #141a26" } : { background: "#fffdf8", boxShadow: "3px 3px 0 0 rgba(79,70,229,.45)" }}>
                  {m.sender === "ai" ? <CitedText text={m.text} sources={project.sources} /> : m.text}
                </div>
              </div>
            ))}
            {busy && !streaming && <div className="flex justify-start" data-testid="chat-thinking"><div className="chip-b border-[1.5px] border-dashed border-[#141a26]/50 bg-white/70 px-3 py-2 hand-sm caret">Consulting findings</div></div>}
            {project.messages.length <= 1 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1" data-testid="chat-quick-prompts">
                {QUICK.map((q, i) => <button key={q} type="button" onClick={() => ask(q)} data-testid={`chat-quick-${i}`} className={`btn-secondary pop-in h-7 px-2.5 text-[13px] ${i % 2 ? "rotate-[1deg]" : "-rotate-[1deg]"}`} style={{ animationDelay: `${200 + i * 80}ms` }}>{q}</button>)}
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="flex items-end gap-2 border-t-[1.5px] border-dashed border-[#141a26]/25 p-2.5">
        <textarea
          data-testid="workspace-followup-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
          disabled={!ready || busy}
          rows={1}
          placeholder={ready ? "Ask about this research\u2026" : "Available after synthesis"}
          className="input h-auto min-h-[34px] max-h-28 resize-none py-1.5 text-[13.5px] disabled:bg-stone-50"
          aria-label="Ask the analyst"
        />
        <button type="submit" disabled={!ready || busy || !input.trim()} className="btn-primary h-[34px] w-[34px] shrink-0 p-0" aria-label="Send message" data-testid="workspace-followup-submit-btn"><ArrowUp className="h-3.5 w-3.5" /></button>
      </form>
    </aside>
  );
};
