"use client";

import { hideHeader } from "@/contexts/header-context";
import { NavBar } from "./nav-bar";

export function Header() {
  if (hideHeader()) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="h-16" />
    </>
  );
}
