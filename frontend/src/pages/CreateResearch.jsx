import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useResearchStore } from "@/store/useResearchStore";
import { StepSubject } from "@/components/create/StepSubject";
import { StepSources } from "@/components/create/StepSources";
import { StepReview } from "@/components/create/StepReview";

const STEPS = [["Research subject", "What to investigate"], ["Sources & focus", "Inputs and depth"], ["Review & configure", "Confirm and launch"]];
const SHAPES = ["cut-b tilt-l", "cut-d tilt-r", "cut-c tilt-l"];

export default function CreateResearch() {
  const navigate = useNavigate();
  const createProject = useResearchStore((s) => s.createProject);
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [preset, setPreset] = useState("General");
  const [urls, setUrls] = useState([]);
  const [depth, setDepth] = useState("deep");
  const [launching, setLaunching] = useState(false);

  const canContinue = query.trim().length >= 12;

  const launch = () => {
    setLaunching(true);
    const p = createProject({ query, urls, depth, preset });
    toast.success("Research engine started", { description: p.title });
    navigate(`/project/${p.id}`);
  };

  return (
    <div className="pt-6 page-in" data-testid="create-research-page">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[4.5rem] lg:self-start">
          <h1 className="display text-[38px] leading-[0.95] tracking-tight">New <em className="scribble"><span className="sunset">brief</span></em></h1>
          <p className="hand mt-3 -rotate-1 text-[#3f3b35]">Three steps. Nothing runs until you launch.</p>
          <ol className="mt-5 flex gap-2 lg:flex-col lg:gap-0" data-testid="create-stepper">
            {STEPS.map(([title, sub], i) => (
              <li key={title} className="relative flex flex-1 items-start gap-2.5 lg:border-l-[1.5px] lg:border-dashed lg:border-[#141a26]/30 lg:py-2 lg:pl-3">
                {i === step && <span className="absolute -left-[2px] top-2 hidden h-6 w-[3px] bg-[#141a26] lg:block" style={{ borderRadius: "2px 1px 3px 1px" }} />}
                <span className={`chip-a grid h-6 w-6 shrink-0 place-items-center font-mono text-[11px] transition-transform duration-200 ${i < step ? "rotate-[4deg] bg-teal-600 text-white" : i === step ? "-rotate-[5deg] border-[1.5px] border-[#141a26] text-[#141a26]" : "border-[1.5px] border-dashed border-[#141a26]/40 text-[#6f6a62]"}`} style={i === step ? { background: "linear-gradient(135deg, #f3d78f, #e3b04b)", boxShadow: "2px 2px 0 0 #141a26" } : undefined}>{i < step ? "\u2713" : i + 1}</span>
                <div className="hidden sm:block">
                  <p className={`text-[13px] font-medium ${i === step ? "text-stone-900" : "text-stone-700"}`}>{title}</p>
                  <p className="hidden text-[12px] text-stone-800 lg:block">{sub}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <section className={`panel tape flex min-h-[420px] flex-col p-6 sm:p-8 ${SHAPES[step]}`}>
          {step === 0 && <StepSubject query={query} setQuery={setQuery} preset={preset} setPreset={setPreset} canContinue={canContinue} onNext={() => setStep(1)} />}
          {step === 1 && <StepSources urls={urls} setUrls={setUrls} depth={depth} setDepth={setDepth} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
          {step === 2 && <StepReview query={query} preset={preset} urls={urls} depth={depth} onBack={() => setStep(1)} onLaunch={launch} launching={launching} />}
        </section>
      </div>
    </div>
  );
}
