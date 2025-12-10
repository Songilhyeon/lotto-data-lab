import { useContext } from "react";
import { PageViewContext } from "@/app/PageViewProvider";

export const usePageView = () => {
  const ctx = useContext(PageViewContext);

  if (!ctx) {
    throw new Error("usePageView must be used within PageViewProvider");
  }

  const setConfig = (payload: Partial<typeof ctx.config>) => {
    ctx.dispatch({ type: "SET_CONFIG", payload });
  };

  return {
    hydrated: ctx.hydrated,
    config: ctx.config,
    setConfig,
  };
};
