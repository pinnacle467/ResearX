import { useEffect, useState } from "react";

const subscribe = (query, onChange) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : false));
  useEffect(() => subscribe(query, (e) => setMatches(e.matches)), [query]);
  return matches;
};

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
