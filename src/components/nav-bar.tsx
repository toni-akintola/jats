"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, Globe, Menu, User } from "lucide-react";

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
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Left Section - Logo */}
        <div className="w-1/4">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-[#f4ac7b]" />
            <span className="text-2xl font-bold text-white">PropAI</span>
          </Link>
        </div>

        {/* Middle Section - Navigation */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-8">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/dashboard">Search</NavLink>
            <NavLink href="/portfolio">Portfolio</NavLink>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="w-1/4 flex items-center gap-4 justify-end">
          <Button variant="ghost" className="hidden md:flex">
            PropAI your portfolio
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Globe className="h-4 w-4" />
          </Button>
          <Link href="/profile">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full px-4 bg-blue-900/50 hover:bg-blue-800"
            >
              <Menu className="h-4 w-4 text-white" />
              <User className="h-4 w-4 text-white" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
