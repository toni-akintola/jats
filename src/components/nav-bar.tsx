"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Bot,
  Globe,
  Menu,
  User,
  Home,
  Map,
  Search,
  Briefcase,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  animationColor?: string;
}

function NavLink({ href, children, animationColor = "#f4ac7b" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-white font-medium text-lg hover:text-white transition-colors relative group ${
        isActive ? "font-bold text-[#f4ac7b]" : ""
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 transition-all ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
        style={{ backgroundColor: animationColor }}
      />
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0e3b5c]/90 backdrop-blur-md border-b border-white/20"
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
            {!isLandingPage && (
              <>
                <NavLink href="/">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </div>
                </NavLink>
                <NavLink href="/map">
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    Maps
                  </div>
                </NavLink>
                <NavLink href="/portfolio">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Portfolio
                  </div>
                </NavLink>
                <NavLink href="/search">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </div>
                </NavLink>
              </>
            )}
            {isLandingPage && (
              <>
                <NavLink href="#">About</NavLink>
                <NavLink href="#">Pricing</NavLink>
                <NavLink href="/search">Search</NavLink>
                <NavLink href="/portfolio">Portfolio</NavLink>
              </>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="w-1/4 flex items-center gap-4 justify-end">
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
