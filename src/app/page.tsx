import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50">
      <div className="container mx-auto px-4 py-24">
        <nav className="absolute top-0 left-0 right-0 p-6">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              feels
            </span>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-purple-700 hover:text-purple-900"
              >
                Try Now →
              </Button>
            </Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto mt-20 text-center space-y-6">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              Swarm Intelligence
            </span>
            <br />
            Meets Market Sentiment
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Harness the power of AI swarms to analyze market sentiment in
            real-time. Get instant insights from thousands of data points across
            the web.
          </p>

          <div className="flex gap-4 justify-center mt-12">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
              >
                Start Analyzing
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Low Latency</h3>
              <p className="text-gray-600">
                Get sentiment analysis results in milliseconds, powered by our
                distributed swarm architecture.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Rich Visualizations
              </h3>
              <p className="text-gray-600">
                Beautiful, intuitive data visualizations that make complex
                sentiment data easy to understand.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                Multi-Source Analysis
              </h3>
              <p className="text-gray-600">
                Aggregate insights from multiple sources using our intelligent
                swarm of data collectors.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
