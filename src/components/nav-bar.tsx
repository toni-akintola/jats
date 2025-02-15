"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl text-white">feels</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/about" className="text-white/80 hover:text-white">
            about
          </Link>
          <Link href="/pricing" className="text-white/80 hover:text-white">
            pricing
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              try now →
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
