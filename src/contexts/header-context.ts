"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

interface HeaderContextType {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  hidden: false,
  setHidden: () => {},
});

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  return (
    <HeaderContext.Provider value={{ hidden, setHidden }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
