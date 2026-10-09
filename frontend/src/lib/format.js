const UNITS = [[31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"]];

export const relTime = (iso) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const [size, label] = UNITS.find(([s]) => seconds >= s) || [1, "s"];
  return `${Math.floor(seconds / size)}${label} ago`;
};

export const isValidUrl = (v) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v.trim());

export function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function projectToMarkdown(p) {
  const src = (n) => p.sources[n - 1]?.title || `Source ${n}`;
  const lines = [`# ${p.title}`, "", `> ${p.query}`, "", `Status: ${p.status} · Depth: ${p.depth} · Updated ${p.updatedAt}`, ""];
  if (p.summary) lines.push("## Executive summary", "", p.summary, "");
  if (p.takeaways.length) {
    lines.push("## Key takeaways", "");
    p.takeaways.forEach((t) => lines.push(`- **${t.point}**: ${t.implication}`));
    lines.push("");
  }
  if (p.findings.length) {
    lines.push("## Findings", "");
    p.findings.forEach((f) => {
      const refs = f.sourceIds.map((id) => p.sources.findIndex((s) => s.id === id) + 1).filter((n) => n > 0);
      lines.push(`### ${f.headline}`, `*${f.category} · ${f.confidence} confidence*`, "", f.detail, "", refs.length ? `Sources: ${refs.map((n) => `[${n}] ${src(n)}`).join(", ")}` : "", "");
    });
  }
  if (p.sources.length) {
    lines.push("## Sources", "");
    p.sources.forEach((s, i) => lines.push(`${i + 1}. ${s.title}${s.url ? `: ${s.url}` : ""} (${s.status})`));
  }
  return lines.join("\n");
}
