import { discoverSources, extractSource, generatePayload, answerFor } from "@/data/generator";
import { nowIso, uid } from "@/lib/types";

const running = new Set();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** First attempt fails when the query mentions "fail", otherwise ~1 in 5. Retries always succeed. */
const shouldFail = (p) => (p.retryCount || 0) === 0 && (/\bfail/i.test(p.query) || Math.random() < 0.2);

/** Step-by-step simulation: t0 analyzing 15% → t2 45% parsed → t4 synthesizing 75% → t6 completed 100%. */
export async function runEngine(id, get) {
  if (running.has(id)) return;
  running.add(id);
  const { patchProject, log } = get();
  const current = () => get().projects.find((p) => p.id === id);
  try {
    const p0 = current();
    if (!p0) return;
    const alreadyDiscovered = p0.sources.some((s) => s.origin === "discovered");
    const discovered = alreadyDiscovered ? [] : discoverSources(p0.title, p0.depth, p0.sources);
    patchProject(id, { status: "analyzing", progressPercent: 15, error: null, sources: [...p0.sources, ...discovered] });
    log(id, alreadyDiscovered ? "Reusing extracted sources from previous attempt" : "Scrape sources and index domain trees...");
    await wait(900);
    if (!alreadyDiscovered) log(id, `Discovered ${discovered.length} additional sources via web index`);
    await wait(1100);
    const p2 = current();
    if (!p2) return;
    patchProject(id, { progressPercent: 45, sources: p2.sources.map((s) => ({ ...s, status: "parsed" })) });
    log(id, `Parsed ${p2.sources.length} sources: extracting claims`);
    await wait(2000);
    const p4 = current();
    if (!p4) return;
    const extracted = p4.sources.map((s) => extractSource(s, p4.title));
    patchProject(id, { status: "synthesizing", progressPercent: 75, sources: extracted });
    log(id, "Clustering claims and generating findings...");
    await wait(2000);
    const p6 = current();
    if (!p6) return;
    if (shouldFail(p6)) {
      const groups = Math.max(1, p6.sources.length - 1);
      patchProject(id, { status: "failed", progressPercent: 75, error: { stage: "Synthesizing findings", code: "SYNTH_TIMEOUT", message: `Claim clustering stalled after ${groups} of ${p6.sources.length + 2} groups. Extracted sources are intact: retrying reuses them and skips ingestion.` } });
      log(id, "Synthesis timed out: run marked failed");
      return;
    }
    const payload = generatePayload(p6);
    const greeting = { id: uid("m_"), sender: "ai", timestamp: nowIso(), text: `Analysis complete. ${p6.sources.length} sources were extracted and ${p6.sources.reduce((a, s) => a + (s.extractedSnippetCount || 0), 0)} claims clustered into ${payload.findings.length} findings. Ask me about trade-offs, risks, or how to apply this to your stack.` };
    patchProject(id, { status: "completed", progressPercent: 100, ...payload, messages: [greeting] });
    log(id, `Research complete: ${payload.findings.length} findings, ${payload.takeaways.length} takeaways`);
  } finally {
    running.delete(id);
  }
}

/** Simulated streamed response: appends tokens to an analyst message at ~30ms intervals. */
export async function streamAnswer(id, question, get) {
  const { addMessage, appendToMessage, patchProject } = get();
  const project = get().projects.find((p) => p.id === id);
  if (!project) return;
  const { text, refs } = answerFor(project, question);
  const aiId = uid("m_");
  await wait(600);
  addMessage(id, { id: aiId, sender: "ai", text: "", timestamp: nowIso(), referencedFindings: refs, streaming: true });
  const tokens = text.split(/(\s+)/);
  for (const tok of tokens) {
    appendToMessage(id, aiId, tok);
    await wait(tok.trim() ? 28 : 0);
  }
  const p = get().projects.find((x) => x.id === id);
  if (p) patchProject(id, { messages: p.messages.map((m) => (m.id === aiId ? { ...m, streaming: false } : m)) });
}
