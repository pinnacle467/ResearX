/** Enumerations shared by the store, the engine and the UI. */
export const RESEARCH_STATUS = ["draft", "queued", "analyzing", "synthesizing", "completed", "failed"];
export const IN_PROGRESS = ["queued", "analyzing", "synthesizing"];
export const CATEGORIES = ["Market Trend", "Technical Insight", "Risk Factor", "Competitive Edge"];
export const DEPTHS = {
  fast: { label: "Fast", hint: "2-3 min preview", sources: "3-4 sources" },
  deep: { label: "Deep", hint: "Comprehensive", sources: "6-8 sources" },
  exhaustive: { label: "Exhaustive", hint: "Max coverage", sources: "10+ sources" },
};
export const PRESETS = ["Market Analysis", "Technical Deep Dive", "Competitive Landscape"];

export const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);
export const nowIso = () => new Date().toISOString();
export const domainOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
