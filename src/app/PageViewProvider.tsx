"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";

interface PageViewState {
  hydrated: boolean;
  config: {
    enabled: boolean;
  };
}

type PageViewAction =
  | { type: "HYDRATE" }
  | { type: "SET_CONFIG"; payload: Partial<PageViewState["config"]> };

interface PageViewContextValue extends PageViewState {
  dispatch: (action: PageViewAction) => void;
}

export const PageViewContext = createContext<PageViewContextValue | null>(null);

export const PageViewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<PageViewState>({
    hydrated: false,
    config: { enabled: true },
  });

  const dispatch = useCallback((action: PageViewAction) => {
    setState((prev) => {
      switch (action.type) {
        case "HYDRATE":
          return { ...prev, hydrated: true };
        case "SET_CONFIG":
          return { ...prev, config: { ...prev.config, ...action.payload } };
        default:
          return prev;
      }
    });
  }, []);

  // hydration safe
  useEffect(() => {
    queueMicrotask(() => dispatch({ type: "HYDRATE" }));
  }, [dispatch]);

  return (
    <PageViewContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PageViewContext.Provider>
  );
};
