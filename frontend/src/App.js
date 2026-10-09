import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { useResearchStore } from "@/store/useResearchStore";
import Dashboard from "@/pages/Dashboard";
import CreateResearch from "@/pages/CreateResearch";
import Workspace from "@/pages/Workspace";

function App() {
  const resume = useResearchStore((s) => s.resumeInterrupted);
  useEffect(() => { resume(); }, [resume]);

  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL || "/"}>
        <TooltipProvider delayDuration={200}>
          <Header />
          <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 pb-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<CreateResearch />} />
              <Route path="/project/:id" element={<Workspace />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" toastOptions={{ className: "!bg-[#fffdf8] !border-[1.5px] !border-[#141a26] !text-[#141a26] !text-[13px] !shadow-[3px_3px_0_0_#e3b04b] !rounded-[11px_4px_10px_5px/7px_10px_4px_11px]", duration: 2600 }} />
        </TooltipProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
