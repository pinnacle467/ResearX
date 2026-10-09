import { domainOf, uid } from "@/lib/types";

const DISCOVERY_POOL = [
  ["Industry analysis and market sizing", "https://www.mckinsey.com/featured-insights", 88],
  ["Peer-reviewed survey of the current state of the field", "https://arxiv.org/list/cs/recent", 93],
  ["Regulatory and policy briefing", "https://www.oecd.org/en/publications.html", 85],
  ["Practitioner post-mortem and benchmark notes", "https://engineering.fb.com/", 79],
  ["Analyst note on adoption and spend", "https://www.gartner.com/en/insights", 81],
  ["Standards body technical report", "https://www.iso.org/standards.html", 86],
  ["Earnings-call transcripts and investor commentary", "https://www.reuters.com/business/", 90],
  ["Open dataset and reproducibility notes", "https://paperswithcode.com/", 83],
];

const COUNTS = { fast: 2, deep: 4, exhaustive: 6 };

export function discoverSources(topic, depth, existing) {
  const have = new Set(existing.map((s) => domainOf(s.url || "")));
  const short = topic.length > 48 ? topic.slice(0, 45).trimEnd() + "…" : topic;
  return DISCOVERY_POOL.filter(([, url]) => !have.has(domainOf(url)))
    .slice(0, COUNTS[depth] || 3)
    .map(([kind, url, score]) => ({
      id: uid("src_"), title: `${short}: ${kind}`, url, type: "url", origin: "discovered", status: "queued", relevanceScore: score,
      extractedSnippetCount: 0, extractedSnippets: [], trustRank: score >= 90 ? "A" : score >= 80 ? "B" : "C",
    }));
}

export function extractSource(source, topic) {
  const snippets = [
    `Across the sources reviewed on ${topicPhrase(topic)}, the strongest evidence clusters around adoption drivers and cost structure rather than headline capability claims.`,
    `Published figures vary by methodology; the ${domainOf(source.url || "")} material is most useful for its disclosed assumptions, which allow like-for-like comparison.`,
  ];
  return { ...source, status: "extracted", extractedSnippetCount: 2 + Math.floor(Math.random() * 5), extractedSnippets: snippets, relevanceScore: source.relevanceScore ?? 78 };
}

const TEMPLATES = {
  "Market Analysis": {
    summary: (t) => `Demand for ${t} is growing from a small base, but growth is concentrated in a handful of buyer segments and procurement cycles are longer than vendor commentary implies. Pricing pressure is emerging as entrants compete on total cost rather than features. Expect consolidation before standardisation.`,
    findings: (t) => [
      ["Market Trend", "Adoption is concentrated, not broad-based", `Spend on ${t} is dominated by a small cohort of early adopters with an existing data or platform advantage. Mid-market buyers remain in pilot, and the pilot-to-production conversion rate is the figure most vendors avoid disclosing.`, "High"],
      ["Technical Insight", "Integration cost exceeds licence cost", `For ${t}, implementation and integration work typically outweighs the software line item over a three-year horizon. Buyers who budget only for the licence underestimate total cost by a wide margin.`, "Medium"],
      ["Risk Factor", "Pricing is compressing faster than expected", `Multiple entrants are competing on cost of ownership for ${t}, and reference prices disclosed in the sources have fallen year on year. Margin assumptions built on today's list prices are fragile.`, "Medium"],
      ["Competitive Edge", "Distribution beats product in the current phase", `Vendors bundling ${t} into existing platforms are winning deals against standalone products with superior features. Channel access is the decisive variable until the category standardises.`, "High"],
    ],
    takeaways: (t) => [
      ["Size the market on production deployments, not pilots.", `Pilot counts for ${t} overstate near-term revenue by a large factor.`],
      ["Model total cost of ownership, not licence price.", "Integration services are the larger and stickier revenue pool."],
      ["Watch bundling moves from incumbents.", "Distribution advantages will decide the next 18 months more than roadmap features."],
    ],
  },
  "Technical Deep Dive": {
    summary: (t) => `The technical literature on ${t} is more cautious than the marketing. Headline benchmarks measure the easy case; the hard cases (scale, adversarial inputs, and operational cost) show material degradation. The most reliable results come from independent evaluations rather than vendor reports.`,
    findings: (t) => [
      ["Technical Insight", "Benchmark results do not transfer to production conditions", `Reported performance for ${t} is measured under controlled inputs. Independent evaluations show a consistent drop when inputs are noisy, long, or adversarial, and the gap widens with scale.`, "High"],
      ["Risk Factor", "Operational cost is under-reported", `Few sources on ${t} disclose end-to-end cost at production load. Where figures exist, infrastructure and monitoring dominate, and they scale with usage rather than being amortised.`, "Medium"],
      ["Market Trend", "Tooling is maturing faster than the core method", `The ecosystem around ${t} (evaluation harnesses, observability, deployment tooling) is improving quarter on quarter, which lowers the barrier to adoption even where the underlying approach is unchanged.`, "Medium"],
      ["Competitive Edge", "Teams that invest in evaluation ship faster", `Across case studies on ${t}, organisations with rigorous internal evaluation suites iterate more quickly and avoid regressions. Evaluation infrastructure is the leading indicator of successful adoption.`, "High"],
    ],
    takeaways: (t) => [
      ["Re-run vendor benchmarks on your own data before committing.", `Expect a measurable gap for ${t} under realistic inputs.`],
      ["Budget for operations, not just build.", "Monitoring and infrastructure are recurring and scale with load."],
      ["Build the evaluation harness first.", "It is the highest-leverage engineering investment in this area."],
    ],
  },
  "Competitive Landscape": {
    summary: (t) => `The competitive field for ${t} is splitting into platform incumbents extending into the category and specialists competing on depth. Incumbents hold distribution; specialists hold the technical lead, for now. The sources suggest the window for specialists to build defensible positions is narrowing.`,
    findings: (t) => [
      ["Competitive Edge", "Incumbents are bundling, specialists are differentiating on depth", `Large platforms are adding ${t} as a feature of existing suites, while specialists compete on accuracy, configurability and support. Buyer behaviour in the sources favours bundles unless the specialist advantage is large and measurable.`, "High"],
      ["Market Trend", "Partnership announcements are outpacing product releases", `Announced partnerships around ${t} have grown faster than shipped integrations, a sign of positioning ahead of capability. Treat partnership press as intent, not delivery.`, "Medium"],
      ["Risk Factor", "Switching costs are still low", `Because standards for ${t} are immature, buyers can move between vendors with limited lock-in. This favours buyers today but means specialists lack a durable moat.`, "Medium"],
      ["Technical Insight", "Differentiation is moving to data and workflow, not core capability", `Core capability for ${t} is converging across vendors. The remaining differentiation is in proprietary data, workflow integration and domain-specific tuning.`, "High"],
    ],
    takeaways: (t) => [
      ["Expect the category to consolidate around platforms.", `Specialists in ${t} need a data or workflow moat within 12-18 months.`],
      ["Discount partnership announcements.", "Shipped integrations are the signal; press releases are noise."],
      ["Negotiate hard on contracts now.", "Low switching costs are a buyer advantage that will not last."],
    ],
  },
};
TEMPLATES.General = TEMPLATES["Technical Deep Dive"];

export function generatePayload(project) {
  const tpl = TEMPLATES[project.preset] || TEMPLATES.General;
  const t = topicPhrase(project.title);
  const ids = project.sources.map((s) => s.id);
  const pick = (i) => [ids[i % ids.length], ids[(i + 1) % ids.length]].filter((v, k, a) => v && a.indexOf(v) === k);
  return {
    summary: tpl.summary(t),
    findings: tpl.findings(t).map(([category, headline, detail, confidence], i) => ({ id: uid("f_"), category, headline, detail, confidence, sourceIds: pick(i) })),
    takeaways: tpl.takeaways(t).map(([point, implication]) => ({ id: uid("t_"), point, implication })),
  };
}

const STOP = new Set(["a", "an", "the", "to", "of", "from", "for", "and", "or", "in", "on", "with", "by", "at", "vs"]);

const LEAD = new Set(["how", "what", "which", "why", "when", "where", "can", "could", "does", "do", "did", "is", "are", "should", "will", "would", "much", "many", "we", "i", "you", "they", "our", "the", "a", "an", "it"]);

export function titleFromQuery(q) {
  const s = q.trim().replace(/\?+$/, "").split(/[,;:\u2014\u2013]| - /)[0];
  const words = s.split(/\s+/);
  let dropped = 0;
  while (words.length > 3 && dropped < 3 && LEAD.has(words[0].toLowerCase())) { words.shift(); dropped++; }
  const kept = words.slice(0, 8);
  while (kept.length > 3 && STOP.has(kept[kept.length - 1].toLowerCase())) kept.pop();
  const out = kept.join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
}

const topicPhrase = (title) => (/^[A-Z][a-z]/.test(title) ? title.charAt(0).toLowerCase() + title.slice(1) : title);

export function answerFor(project, question) {
  const q = question.toLowerCase();
  const n = (id) => project.sources.findIndex((s) => s.id === id) + 1;
  const cite = (f) => f.sourceIds.map((id) => `[Source ${n(id)}]`).join(" ");
  const byCat = (c) => project.findings.filter((f) => f.category === c);
  if (/risk|downside|counter|fail|threat/.test(q)) {
    const risks = byCat("Risk Factor");
    return { text: `The principal risk is: ${risks.map((f) => `${f.headline.toLowerCase()}: ${f.detail} ${cite(f)}`).join("\n\n")}\n\nMitigation follows from the takeaways: ${project.takeaways[1]?.implication || project.takeaways[0]?.implication}`, refs: risks.map((f) => f.id) };
  }
  if (/c-level|exec|board|summar|tl;dr|brief/.test(q)) {
    return { text: `For an executive audience:\n\n${project.summary}\n\nThree decisions follow:\n${project.takeaways.map((t, i) => `${i + 1}. ${t.point}`).join("\n")}`, refs: [] };
  }
  if (/compare|2024|previous|last year|change|trend/.test(q)) {
    const trends = byCat("Market Trend");
    return { text: `Relative to the 2024 baseline, the direction of travel is clear: ${trends.map((f) => `${f.detail} ${cite(f)}`).join(" ")}\n\nThe sources are consistent on direction but differ on magnitude: treat the numbers as ranges, not point estimates.`, refs: trends.map((f) => f.id) };
  }
  if (/source|credib|trust|reliab|evidence/.test(q)) {
    const top = [...project.sources].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))[0];
    return { text: `The strongest source is "${top?.title}" (relevance ${top?.relevanceScore}, trust rank ${top?.trustRank}) [Source ${n(top?.id)}]. It is cited in ${project.findings.filter((f) => f.sourceIds.includes(top?.id)).length} of ${project.findings.length} findings. Lower-ranked sources were used for corroboration rather than as primary evidence.`, refs: [] };
  }
  const best = project.findings.find((f) => f.confidence === "High") || project.findings[0];
  return { text: `The finding most relevant to that question is "${best.headline}": ${best.detail} ${cite(best)}\n\nIf you want to go deeper, ask about the risks, the competitive implications, or how this compares to the 2024 picture.`, refs: [best.id] };
}
