import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(135deg, 
          #0e3b5c 0%,
          #5e4f6d 25%,
          #9f6671 50%,
          #d8897b 75%,
          #f4ac7b 100%
        )`,
      }}
    >
      {/* Add a subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5" />

      <div className="relative">
        {" "}
        {/* This wrapper keeps content above the overlay */}
        <NavBar />
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="pt-32 pb-16">
            <main className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-6xl font-bold tracking-tight text-white">
                <span className="text-white">sentiment analysis</span>
                <br />
                that actually works
              </h1>

              <p className="text-xl text-white/80 max-w-2xl mx-auto mt-6">
                real-time market vibes powered by AI swarms. get instant
                insights from thousands of data points across the web.
              </p>

              <div className="flex gap-4 justify-center mt-12">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-[#0e3b5c] hover:bg-[#0e3b5c]/90 text-white"
                  >
                    start analyzing
                  </Button>
                </Link>
              </div>
            </main>
          </section>

          {/* Features Grid */}
          <section className="py-20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#0e3b5c] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">lightning fast</h3>
                <p className="text-gray-600">
                  get results in milliseconds with our distributed swarm
                  architecture
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#0e3b5c] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">clean data viz</h3>
                <p className="text-gray-600">
                  beautiful visualizations that make complex sentiment data easy
                  to understand
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#0e3b5c] text-white flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  multi-source data
                </h3>
                <p className="text-gray-600">
                  aggregate insights from multiple sources using our intelligent
                  swarm
                </p>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-20 text-center">
            <h2 className="text-3xl font-bold mb-12 text-white">
              trusted by data-driven teams
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="h-12 bg-white/80 rounded-lg"></div>
              <div className="h-12 bg-white/80 rounded-lg"></div>
              <div className="h-12 bg-white/80 rounded-lg"></div>
              <div className="h-12 bg-white/80 rounded-lg"></div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-white">
                ready to get started?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                join thousands of teams using feels to understand market
                sentiment
              </p>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0e3b5c] hover:bg-[#0e3b5c]/90 text-white"
                >
                  try for free →
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
