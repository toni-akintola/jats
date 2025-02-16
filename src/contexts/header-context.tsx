"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type HeaderContextType = {
  hidden: boolean;
  setHidden: (hide: boolean) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  return (
    <HeaderContext.Provider value={{ hidden, setHidden }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
