"use client";
import { NavBar } from "./nav-bar";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Only hide on landing page
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <NavBar />
    </header>
  );
}
