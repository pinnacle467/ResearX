import { uid } from "@/lib/types";

const h = (n) => new Date(Date.now() - n * 3600_000).toISOString();

const src = (title, url, status, relevanceScore, extractedSnippetCount, snippets, type = "url") => ({
  id: uid("src_"), title, url, type, origin: "input", status, relevanceScore, extractedSnippetCount, extractedSnippets: snippets, trustRank: relevanceScore >= 90 ? "A" : relevanceScore >= 80 ? "B" : "C",
});

function build(p) {
  const findings = p.findings.map((f) => ({ id: uid("f_"), ...f, sourceIds: f.sourceIds.map((n) => p.sources[n - 1].id) }));
  const takeaways = p.takeaways.map((t) => ({ id: uid("t_"), ...t }));
  const messages = p.messages.map((m, i) => ({ id: uid("m_"), ...m, timestamp: h(p.ago - 0.2 + i * 0.02) }));
  return { ...p, findings, takeaways, messages, createdAt: h(p.ago + 2), updatedAt: h(p.ago), progressPercent: p.status === "completed" ? 100 : p.progressPercent, logs: p.logs.map((message, i) => ({ t: h(p.ago + 0.1 - i * 0.01), message })) };
}

export const seedProjects = () => [
  build({
    id: "proj_ctx",
    title: "LLM Context Window Limits",
    query: "How much usable capacity do frontier models really deliver at 128k-1M token context lengths, and where does retrieval beat long context on cost and accuracy?",
    status: "completed",
    depth: "deep",
    ago: 3,
    logs: ["Research complete: 4 findings, 3 takeaways", "Clustering claims and generating findings...", "Extracted 23 claims across 4 sources", "Scrape sources and index domain trees..."],
    sources: [
      src("Lost in the Middle: How Language Models Use Long Contexts", "https://arxiv.org/abs/2307.03172", "extracted", 96, 7, ["Performance is highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts.", "The U-shaped curve persists even for models explicitly trained on long sequences."]),
      src("RULER: What's the Real Context Size of Your Long-Context Language Models?", "https://arxiv.org/abs/2404.06654", "extracted", 94, 6, ["Almost all models exhibit large degradation as sequence length increases, despite achieving perfect accuracy on the vanilla needle-in-a-haystack test.", "Only half of the evaluated models maintain satisfactory performance at their claimed context length of 32K tokens or greater."]),
      src("Gemini 1.5 technical report: long-context evaluation", "https://storage.googleapis.com/deepmind-media/gemini/gemini_v1_5_report.pdf", "extracted", 88, 5, ["Near-perfect recall (>99%) on single-needle retrieval up to at least 10M tokens across modalities.", "Multi-needle and reasoning-over-retrieval tasks show a steeper decline than single-needle recall."], "pdf"),
      src("Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study", "https://arxiv.org/abs/2407.16833", "extracted", 83, 5, ["Long-context models consistently outperform RAG in averaged performance when resourced sufficiently, but RAG's significantly lower cost remains a distinct advantage.", "A simple routing approach, using RAG when the model's answer agrees with RAG's answer, reduces cost by 65% with comparable performance."]),
    ],
    summary: "Advertised context lengths overstate usable capacity. Independent benchmarks show accuracy drops well before the nominal limit, with mid-context positions penalised most. Long context wins on accuracy when budgets allow; retrieval wins on cost by a wide margin. The practical answer for production is a router that only escalates to long context when retrieval is uncertain.",
    findings: [
      { category: "Technical Insight", headline: "Usable context is roughly half the advertised figure", detail: "RULER finds that only about half of the models tested hold satisfactory accuracy at their claimed 32k+ window, and the needle-in-a-haystack test that vendors cite is near-saturated and uninformative. Treat the marketed window as an upper bound, not a design parameter.", confidence: "High", sourceIds: [2, 1] },
      { category: "Risk Factor", headline: "Mid-context information is systematically under-weighted", detail: "The 'lost in the middle' effect is stable across model families: facts placed in the central third of a long prompt are recalled measurably worse than those at either edge. Any pipeline that concatenates documents in arbitrary order inherits this bias.", confidence: "High", sourceIds: [1] },
      { category: "Market Trend", headline: "Million-token recall is real for single facts, weaker for reasoning", detail: "Gemini 1.5 reports >99% single-needle recall at 10M tokens, but multi-needle retrieval and reasoning-over-retrieved-content decline much faster. Vendor headline numbers describe the easy case.", confidence: "Medium", sourceIds: [3, 2] },
      { category: "Competitive Edge", headline: "A RAG-first router captures most of the accuracy at ~35% of the cost", detail: "Routing to long context only when the RAG answer disagrees with the model's own answer cut cost by 65% with near-identical accuracy. This is a cheap architectural win that most teams have not shipped yet.", confidence: "High", sourceIds: [4] },
    ],
    takeaways: [
      { point: "Design for ~50% of the advertised context window.", implication: "Chunk and prioritise inputs; do not assume everything in the prompt is read equally." },
      { point: "Put the most important evidence first or last.", implication: "Reorder retrieved passages by relevance to the prompt edges before generation." },
      { point: "Default to retrieval and escalate to long context selectively.", implication: "A disagreement-based router is the most cost-efficient production pattern today." },
    ],
    messages: [
      { sender: "ai", text: "Analysis complete. Four sources were extracted and 23 claims clustered into 4 findings. Ask me about trade-offs, risks, or how to apply this to your stack." },
      { sender: "user", text: "Which finding should I act on first if I'm building a document QA product?" },
      { sender: "ai", text: "Ship the router [Source 4]. It is the only finding with a direct cost lever (−65%) and it does not require model changes. Then fix evidence ordering to counter the mid-context penalty [Source 1]. That is a prompt-assembly change, not an infrastructure one.", referencedFindings: [] },
    ],
  }),
  build({
    id: "proj_batt",
    title: "European Battery Supply Chain 2026",
    query: "Can European cell manufacturers reach cost parity with Chinese LFP imports by 2026, and which bottlenecks (cathode materials, energy prices, or financing) matter most?",
    status: "completed",
    depth: "exhaustive",
    ago: 27,
    logs: ["Research complete: 4 findings, 3 takeaways", "Clustering claims and generating findings...", "Extracted 31 claims across 4 sources", "Scrape sources and index domain trees..."],
    sources: [
      src("Battery 2030: Resilient, sustainable, and circular (McKinsey)", "https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/battery-2030-resilient-sustainable-and-circular", "extracted", 90, 8, ["Europe's announced cell capacity exceeds 1 TWh by 2030, but realised capacity has consistently lagged announcements by 30-40%.", "Energy accounts for 5-10% of cell cost in Europe versus 2-3% in China."]),
      src("Northvolt files for Chapter 11 bankruptcy (Reuters)", "https://www.reuters.com/business/autos-transportation/northvolt-files-chapter-11-bankruptcy-2024-11-21/", "extracted", 92, 6, ["Northvolt had about $5.8 billion in debt and roughly $30 million in cash at filing.", "Ramp-up yield problems at Skellefteå delayed deliveries to BMW, which cancelled a €2 billion order."]),
      src("Global EV Outlook 2024 (IEA)", "https://www.iea.org/reports/global-ev-outlook-2024", "extracted", 95, 9, ["China accounted for over 80% of global LFP cathode production in 2023.", "Average battery pack prices fell to $139/kWh in 2023, with LFP packs in China below $100/kWh."]),
      src("Net-Zero Industry Act (European Commission)", "https://single-market-economy.ec.europa.eu/industry/sustainability/net-zero-industry-act_en", "extracted", 84, 4, ["Target of 40% domestic manufacturing capacity for strategic net-zero technologies by 2030.", "Permitting timelines for strategic projects capped at 12-18 months."]),
    ],
    summary: "Cost parity with Chinese LFP by 2026 is unrealistic for European cell makers. The gap is structural: energy at 3x the cost share, no domestic LFP cathode base, and financing that evaporated after Northvolt. Policy support is real but targets 2030, not 2026. The credible near-term play is premium NMC for European OEMs, not commodity LFP.",
    findings: [
      { category: "Risk Factor", headline: "Financing is now the binding constraint, not technology", detail: "Northvolt's collapse with $5.8bn of debt reset lender appetite for European gigafactories overnight. Several announced plants have been paused or downsized since; announced-vs-realised capacity gaps of 30-40% were already the norm before the filing.", confidence: "High", sourceIds: [2, 1] },
      { category: "Market Trend", headline: "Chinese LFP is already below $100/kWh at pack level", detail: "IEA data puts Chinese LFP packs under $100/kWh in 2023 against a $139/kWh global average. With China controlling 80%+ of LFP cathode output, European entrants face both a cost gap and an input-dependency on the competitor they are trying to displace.", confidence: "High", sourceIds: [3] },
      { category: "Technical Insight", headline: "Energy cost share is 3x higher in Europe", detail: "Energy is 5-10% of European cell cost versus 2-3% in China. Dry-room and formation stages are energy-intensive and do not scale away; long-term PPAs with renewables are the only visible mitigation.", confidence: "Medium", sourceIds: [1] },
      { category: "Competitive Edge", headline: "Permitting reform is the one policy lever that bites before 2030", detail: "The Net-Zero Industry Act caps strategic-project permitting at 12-18 months and targets 40% domestic capacity by 2030. The 2026 window benefits mainly from faster permitting; capacity targets will not move the market before the end of the decade.", confidence: "Medium", sourceIds: [4] },
    ],
    takeaways: [
      { point: "Parity with Chinese LFP by 2026 is not achievable.", implication: "Position European cells as premium NMC with local-content value, not as a cost play." },
      { point: "Capital access decides who survives to 2030.", implication: "Prioritise OEM-backed JVs and public co-financing over merchant gigafactory models." },
      { point: "Energy contracts are a cost-of-goods decision, not a sustainability one.", implication: "Lock in long-dated renewable PPAs before site selection." },
    ],
    messages: [
      { sender: "ai", text: "Analysis complete. Four sources were extracted and 31 claims clustered into 4 findings. Ask me about trade-offs, risks, or how to apply this to your stack." },
    ],
  }),
  build({
    id: "proj_sdb",
    title: "Serverless DB Performance",
    query: "How do serverless Postgres offerings (Neon, Aurora Serverless v2, Supabase) compare on cold-start latency, connection pooling limits, and cost at bursty workloads?",
    status: "completed",
    depth: "fast",
    ago: 70,
    logs: ["Research complete: 4 findings, 3 takeaways", "Clustering claims and generating findings...", "Extracted 17 claims across 3 sources", "Scrape sources and index domain trees..."],
    sources: [
      src("Neon architecture: separation of storage and compute", "https://neon.tech/docs/introduction/architecture-overview", "extracted", 89, 6, ["Compute scales to zero after a period of inactivity; cold starts typically complete in a few hundred milliseconds.", "Storage is a multi-tenant, log-structured service; compute nodes are stateless Postgres instances."]),
      src("Aurora Serverless v2: scaling behaviour", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html", "extracted", 91, 7, ["Scales in increments of 0.5 ACU; minimum capacity cannot be zero except with the newer scale-to-zero configuration.", "Scaling events happen in place without connection drops."]),
      src("Supavisor: a cloud-native Postgres connection pooler", "https://supabase.com/blog/supavisor-1-million", "extracted", 82, 4, ["Supavisor handled 1 million concurrent connections in load testing against a single Postgres cluster.", "Transaction-mode pooling breaks prepared statements unless the client negotiates protocol-level support."]),
    ],
    summary: "The three products make different trade-offs: Neon optimises for true scale-to-zero with sub-second cold starts, Aurora Serverless v2 for in-place scaling without connection drops, and Supabase for pooling scale via Supavisor. For bursty, low-duty-cycle workloads Neon is cheapest; for sustained production traffic Aurora's floor cost is offset by smoother scaling.",
    findings: [
      { category: "Technical Insight", headline: "Scale-to-zero is a storage-architecture decision", detail: "Neon's stateless compute over log-structured storage is what makes sub-second cold starts possible. Aurora's historical 0.5 ACU floor existed because compute and storage were coupled; the newer scale-to-zero mode narrows but does not close the gap.", confidence: "High", sourceIds: [1, 2] },
      { category: "Risk Factor", headline: "Transaction-mode pooling silently breaks prepared statements", detail: "Supavisor and PgBouncer in transaction mode cannot guarantee a session for prepared statements. ORMs that prepare by default will fail intermittently unless protocol-level support is negotiated: a production incident waiting to happen.", confidence: "High", sourceIds: [3] },
      { category: "Market Trend", headline: "Vendors are converging on pooler-as-a-service", detail: "All three ship a managed pooler. The differentiation is moving from 'does it pool' to connection-limit ceilings and multi-tenant isolation, where Supavisor's 1M-connection test sets the public benchmark.", confidence: "Medium", sourceIds: [3, 1] },
      { category: "Competitive Edge", headline: "Aurora wins on scaling without connection drops", detail: "In-place ACU scaling keeps long-lived connections intact during bursts. For workloads with a steady baseline and spiky peaks, this avoids the retry storms that scale-from-zero architectures can trigger.", confidence: "Medium", sourceIds: [2] },
    ],
    takeaways: [
      { point: "Match the product to the duty cycle.", implication: "Neon for idle-heavy dev/preview environments; Aurora for steady production baselines." },
      { point: "Audit ORM prepared-statement behaviour before adopting transaction pooling.", implication: "Set the client to protocol-level or disable server-side prepares explicitly." },
      { point: "Cold start is a tail-latency metric, not an average.", implication: "Benchmark p99 after idle, not steady-state throughput." },
    ],
    messages: [
      { sender: "ai", text: "Analysis complete. Three sources were extracted and 17 claims clustered into 4 findings. Ask me about trade-offs, risks, or how to apply this to your stack." },
    ],
  }),
];
