# Researx

A research notebook. Ask a question, add a few sources if you have them, and get back findings with numbered citations plus a chat to dig into the results.

Live: https://researx.pinnacleweb.online

## Run it

```bash
cd frontend && yarn install && yarn start   # localhost:3000
cd backend && pip install -r requirements.txt && uvicorn server:app --port 8001
```

Data is saved in localStorage (`researx:v2`). Clear it to get the demo projects back.

## What's in it

- Dashboard with search, filters and sorting
- Three-step create flow (question, sources, review)
- Workspace with sources, findings, citations and an analyst chat
- Markdown / JSON export

The research engine is simulated in the browser and doesn't fetch anything from the web. Some runs fail on purpose so the retry flow can be tested; put `fail` in the question to force it.

## Stack

React, Tailwind, Radix, Zustand. The FastAPI backend only has a health check right now.

_**Claude Fable 5.1 was used for minor assistance, testing and code review**_

**Key UX and product decisions**

Every claim links back to a source. Research is only useful if you can trust it. Each finding, takeaway and chat answer has a numbered citation, and the number stays the same everywhere: in the source list, the findings, the chat and the export. Clicking a citation shows the original snippet, so checking a claim takes one click.

The workspace reads left to right. Sources are on the left, findings in the middle and the chat on the right. That's roughly the order you work in: look at the evidence, read the summary, then ask questions. On mobile it turns into three tabs, and it opens on Findings because that's what people come back for.

Progress shows real steps, not a spinner. A run shows named stages (ingesting, extracting, synthesizing), a percentage and a short activity log. Each source shows its own status, so you can see work happening instead of waiting and guessing.

Failure is planned for. If a run fails, you get a clear card saying what went wrong, at which stage, and which sources were kept. Retry reuses those sources, so it's quick. The dashboard shows the failed status too.

The create flow pushes for a good question. Instead of a single search box, it nudges you toward a question with a real trade-off in it. It offers quick add-ons like a timeframe or comparison, and ends with a review step so you know exactly what will run.

Every action gives feedback. Creating, renaming, deleting and exporting all show a confirmation. Deleting asks first. Buttons that aren't available yet say why instead of just being greyed out.

I simulated the engine on purpose. The research runs in the browser instead of calling live services. That kept the focus on the experience, and it means every state, including errors, can be shown on demand. The data structure matches what a real engine would need, so a live one can be added later.

The look is deliberately different from a typical dashboard. The cut-paper notebook style, with slight tilts, tape and handwritten notes, makes it feel like a personal research notebook rather than a generic admin panel. I kept it dense so a lot of information fits on screen without feeling cramped.
