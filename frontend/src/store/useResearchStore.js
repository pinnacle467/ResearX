import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedProjects } from "@/data/seed";
import { titleFromQuery } from "@/data/generator";
import { runEngine, streamAnswer } from "@/engine/simulation";
import { domainOf, nowIso, uid, IN_PROGRESS } from "@/lib/types";

const touch = (p, patch) => ({ ...p, ...patch, updatedAt: nowIso() });

export const useResearchStore = create(
  persist(
    (set, get) => ({
      projects: seedProjects(),
      workspace: "Personal",
      hydrated: false,

      setWorkspace: (workspace) => set({ workspace }),
      getProject: (id) => get().projects.find((p) => p.id === id),

      patchProject: (id, patch) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? touch(p, patch) : p)) })),
      log: (id, message) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, logs: [{ t: nowIso(), message }, ...(p.logs || [])].slice(0, 30) } : p)) })),

      createProject: ({ query, urls, depth, preset }) => {
        const project = {
          id: uid("proj_"),
          title: titleFromQuery(query),
          query: query.trim(),
          preset,
          status: "analyzing",
          depth,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          progressPercent: 10,
          sources: urls.map((url) => ({ id: uid("src_"), title: domainOf(url), url, type: "url", origin: "input", status: "queued", extractedSnippetCount: 0, extractedSnippets: [] })),
          findings: [],
          takeaways: [],
          messages: [],
          error: null,
          retryCount: 0,
          logs: [{ t: nowIso(), message: "Project created: queuing research engine" }],
        };
        set((s) => ({ projects: [project, ...s.projects] }));
        runEngine(project.id, get);
        return project;
      },

      resumeInterrupted: () => {
        get().projects.filter((p) => IN_PROGRESS.includes(p.status)).forEach((p) => runEngine(p.id, get));
        set({ hydrated: true });
      },

      renameProject: (id, title) => get().patchProject(id, { title: title.trim() || get().getProject(id).title }),

      retryProject: (id) => {
        const p = get().getProject(id);
        if (!p || p.status !== "failed") return;
        get().patchProject(id, { status: "queued", progressPercent: 10, error: null, retryCount: (p.retryCount || 0) + 1 });
        get().log(id, `Retry #${(p.retryCount || 0) + 1} requested`);
        runEngine(id, get);
      },

      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      duplicateProject: (id) => {
        const src = get().getProject(id);
        if (!src) return null;
        const copy = { ...src, id: uid("proj_"), title: `${src.title} (copy)`, createdAt: nowIso(), updatedAt: nowIso(), messages: src.messages.slice(0, 1) };
        set((s) => ({ projects: [copy, ...s.projects] }));
        return copy;
      },

      addSource: (id, url) => {
        const p = get().getProject(id);
        if (p.sources.some((s) => s.url === url)) return false;
        const source = { id: uid("src_"), title: domainOf(url), url, type: "url", origin: "input", status: "queued", extractedSnippetCount: 0, extractedSnippets: [] };
        get().patchProject(id, { sources: [...p.sources, source] });
        get().log(id, `Queued ${domainOf(url)} for extraction`);
        setTimeout(() => {
          const cur = get().getProject(id);
          if (!cur) return;
          get().patchProject(id, { sources: cur.sources.map((s) => (s.id === source.id ? { ...s, status: "parsed" } : s)) });
        }, 1200);
        setTimeout(() => {
          const cur = get().getProject(id);
          if (!cur) return;
          get().patchProject(id, { sources: cur.sources.map((s) => (s.id === source.id ? { ...s, status: "extracted", relevanceScore: 76, trustRank: "C", extractedSnippetCount: 3, extractedSnippets: [`Supplementary material from ${domainOf(url)} added mid-session; claims cross-checked against existing findings.`] } : s)) });
          get().log(id, `Extracted ${domainOf(url)}: 3 claims`);
        }, 2600);
        return true;
      },

      addMessage: (id, message) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, messages: [...p.messages, message] } : p)) })),
      appendToMessage: (id, messageId, text) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, messages: p.messages.map((m) => (m.id === messageId ? { ...m, text: m.text + text } : m)) } : p)) })),

      sendMessage: async (id, text) => {
        get().addMessage(id, { id: uid("m_"), sender: "user", text: text.trim(), timestamp: nowIso() });
        await streamAnswer(id, text, get);
      },
    }),
    {
      name: "researx:v2",
      partialize: (s) => ({ projects: s.projects.map((p) => ({ ...p, messages: p.messages.map(({ streaming, ...m }) => m) })), workspace: s.workspace }),
    }
  )
);
