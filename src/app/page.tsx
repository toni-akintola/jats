"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
const companies = [
  { name: "Urban Development Partners", logo: "/logos/udp.svg" },
  { name: "Blackstone Real Estate", logo: "/logos/blackstone.svg" },
  { name: "CBRE Group", logo: "/logos/cbre.svg" },
  { name: "JLL", logo: "/logos/jll.svg" },
  { name: "Cushman & Wakefield", logo: "/logos/cw.svg" },
];

const features = [
  {
    title: "Market Intelligence",
    description:
      "Analyze property values, trends, and growth potential across markets using advanced AI algorithms",
    icon: "📊",
  },
  {
    title: "Opportunity Detection",
    description:
      "Automatically identify undervalued properties and emerging neighborhood trends",
    icon: "🎯",
  },
  {
    title: "Risk Assessment",
    description:
      "Evaluate investment risks using predictive modeling and historical data analysis",
    icon: "🛡️",
  },
];

const benefits = [
  "Reduce research time by 75%",
  "Identify opportunities before they hit the market",
  "Make data-driven investment decisions",
  "Automate property analysis workflows",
];

export default function Home() {
  const [headerRef, headerInView] = useInView();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative" ref={headerRef}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI-Powered Property Discovery for Modern Developers
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Turn market data into actionable insights with our intelligent
            property analysis engine
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c]"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c]"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-[#0e3b5c]/60 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all border border-white/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#f4ac7b] mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-8 items-center mb-16">
            {companies.map((company) => (
              <div
                key={company.name}
                className="opacity-70 hover:opacity-100 transition-all"
              >
                {/* <Image
                  src={company.logo}
                  alt={company.name}
                  className="h-8 w-auto brightness-0 invert"
                /> */}
              </div>
            ))}
          </div>
          <blockquote className="text-center max-w-3xl mx-auto">
            <p className="text-xl text-white/90 mb-4">
              &ldquo;PropAI has transformed how we identify investment
              opportunities. We&apos;ve increased our portfolio value by 32% in
              just six months.&rdquo;
            </p>
            <footer className="text-white/70">
              Sarah Chen, Director of Acquisitions at Urban Development Partners
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#f4ac7b] mb-6">
                Why Choose PropAI?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center">
                    <span className="text-[#f4ac7b] mr-2">✓</span>
                    <span className="text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0e3b5c]/60 p-6 rounded-lg shadow-lg border border-white/10">
              <div className="aspect-video bg-[#0e3b5c] rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#f4ac7b] mb-4">
            Start Discovering Premium Properties Today
          </h2>
          <p className="text-white/80 mb-8">
            14-day free trial • No credit card required
          </p>
          <Button
            size="lg"
            className="bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c]"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0e3b5c] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">PropAI</span>
              <p className="mt-2 text-white/70">
                Transforming property discovery with artificial intelligence
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#f4ac7b] mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#f4ac7b] mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Add social media icons here */}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#f4ac7b] mb-3">Newsletter</h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button className="bg-[#f4ac7b] hover:bg-[#d8897b] text-[#0e3b5c]">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
