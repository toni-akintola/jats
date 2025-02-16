"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const RunningFigure = () => {
  return (
    <div className="animate-bounce flex space-x-12">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center text-white text-4xl animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        >
          🏃
        </div>
      ))}
    </div>
  );
};

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") + "\'s" || "a";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/map");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <div className="absolute inset-0 bg-black/5" />
      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="w-96 h-32 mx-auto flex items-center justify-center">
          <RunningFigure />
        </div>
        {/* <div className="w-96 h-96 mx-auto">
          <Lottie 
            animationData={loadingAnimation} 
            loop={true}
          />
        </div> */}
        <h2 className="text-2xl font-medium text-white mt-8">
          {name} swarm of agents have been deployed...
        </h2>
        <p className="text-white/80 mt-4">
          Analyzing sentiment data from multiple sources
        </p>
      </div>
    </main>
  );
}
