import { useEffect, useState } from "react";
import { IN_PROGRESS } from "@/lib/types";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const useCountUp = (target, ms = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(target * easeOut(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);
  return value;
};

const Numeral = ({ value, decimals = 0, suffix = "" }) => {
  const n = useCountUp(value);
  return <>{n.toFixed(decimals)}{suffix}</>;
};

export const StatsBar = ({ projects }) => {
  const completed = projects.filter((p) => p.status === "completed").length;
  const items = [
    ["Total research runs", projects.length, 0, "", "stat-total", "tint-peach", "#c2410c", "in this workspace", "tilt-l2", "", ""],
    ["Active analysis", projects.filter((p) => IN_PROGRESS.includes(p.status)).length, 0, "", "stat-active", "tint-lemon", "#8a6219", "running right now", "tilt-r", "cut-b tape-right", "sm:mt-3"],
    ["Sources indexed", projects.reduce((a, p) => a + p.sources.length, 0), 0, "", "stat-sources", "tint-mint", "#1f7a70", "every claim cited", "tilt-l", "cut-c", "sm:mt-1"],
    ["Hours saved", completed * 3.5, 1, "h", "stat-hours", "tint-lavender", "#4338ca", "vs. reading it all", "tilt-r2", "cut-d tape-right", "sm:mt-4"],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3 pt-2" data-testid="dashboard-stats">
      {items.map(([label, value, decimals, suffix, id, tint, color, note, tilt, shape, offset], i) => (
        <div key={label} className={`panel panel-hover tape relative overflow-visible px-5 py-4 settle ${tint} ${tilt} ${shape} ${offset}`} style={{ animationDelay: `${i * 70}ms`, "--settle-to": tilt.includes("l2") ? "-1.4deg" : tilt.includes("r2") ? "1.2deg" : tilt.includes("l") ? "-0.7deg" : "0.6deg" }} data-testid={id}>
          <span className="absolute -right-3 -top-4 h-20 w-20 rounded-[60%_40%_55%_45%/50%_60%_40%_50%] opacity-30" style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
          <p className="label-xs">{label}</p>
          <p className="display mt-1 text-[36px] leading-none tabular-nums" style={{ color }}><Numeral value={value} decimals={decimals} suffix={suffix} /></p>
          <p className="hand-sm mt-1.5" style={{ color }}>{note}</p>
        </div>
      ))}
    </div>
  );
};
