"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  animationColor?: string;
}

function NavLink({ href, children, animationColor = "#f4ac7b" }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-white/80 hover:text-white transition-colors relative group"
    >
      {children}
      <span
        className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
        style={{ backgroundColor: animationColor }}
      />
    </Link>
  );
}

export function NavBar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-[#f4ac7b]" />
          <span className="text-2xl font-bold text-white">PropAI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:text-[#f4ac7b] hover:bg-white/10"
          >
            Sign In
          </Button>
          <Button
            className="bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c]"
            variant="ghost"
          >
            Try Now →
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
