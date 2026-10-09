import { Link } from "react-router-dom";
import { FolderSearch, Plus, SearchX } from "lucide-react";

export const EmptyProjects = () => (
  <div className="panel cut-b tape flex flex-col items-start gap-3 px-6 py-10 tilt-l" data-testid="dashboard-empty-state">
    <FolderSearch className="h-5 w-5 text-stone-800" />
    <div>
      <h3 className="display text-[22px] leading-tight">No research projects yet</h3>
      <p className="mt-1 max-w-sm text-[14px] text-stone-700">Start with a question. The engine ingests your sources, extracts claims, and returns categorised findings you can interrogate.</p>
    </div>
    <div className="flex items-center gap-3">
      <Link to="/create" className="btn-primary" data-testid="empty-state-new-project-btn"><Plus className="h-3.5 w-3.5" />New Project</Link>
      <span className="hand -rotate-3 text-[#8a6219]">← start here</span>
    </div>
  </div>
);

export const NoMatches = ({ onReset }) => (
  <div className="panel cut-d tape-right tape flex flex-col items-start gap-3 px-6 py-10 tilt-r" data-testid="dashboard-no-results">
    <SearchX className="h-5 w-5 text-stone-800" />
    <div>
      <h3 className="display text-[22px] leading-tight">No projects match</h3>
      <p className="mt-1 text-[14px] text-stone-700">Adjust the search or switch the status tab.</p>
    </div>
    <button type="button" onClick={onReset} className="btn-secondary" data-testid="dashboard-reset-filters-btn">Reset filters</button>
  </div>
);
