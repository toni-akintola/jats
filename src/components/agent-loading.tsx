"use client";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AgentLoadingProps {
  name: string;
  delay?: number;
  description: string;
  isComplete?: boolean;
}

export function AgentLoading({
  name,
  description,
  delay = 0,
  isComplete = false,
}: AgentLoadingProps) {
  const [status, setStatus] = useState<"pending" | "analyzing" | "complete">(
    "pending",
  );

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStatus("analyzing");
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (isComplete) {
      setStatus("complete");
    }
  }, [isComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 rounded-lg p-4 border border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bot
            className={`h-5 w-5 ${
              status === "complete"
                ? "text-green-400"
                : status === "analyzing"
                  ? "text-blue-400"
                  : "text-white/40"
            }`}
          />
          {status === "analyzing" && (
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay,
              }}
              className="absolute top-0 right-0 h-2 w-2 bg-blue-400 rounded-full"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white/80 font-medium text-sm">{name}</p>
          <p className="text-white/40 text-xs">
            {status === "pending" && "Waiting to start..."}
            {status === "analyzing" && description}
            {status === "complete" && "Analysis complete"}
          </p>
          {status === "analyzing" && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 3,
                delay: 0,
              }}
              className="h-1 bg-blue-400/20 rounded-full mt-2 overflow-hidden"
            >
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-full w-1/3 bg-blue-400 rounded-full"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AgentSwarmLoading({
  completedModules = [],
}: {
  completedModules?: string[];
}) {
  const agents = [
    {
      name: "Location Analyzer",
      description: "Analyzing demographic trends...",
    },
    { name: "Market Analyst", description: "Processing market conditions..." },
    {
      name: "Competitive Intel",
      description: "Gathering property comparables...",
    },
    {
      name: "Regulatory Monitor",
      description: "Checking zoning regulations...",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-white font-medium mb-4">Research Agents</h3>
        <div className="grid gap-4">
          {agents.map((agent, index) => (
            <AgentLoading
              key={agent.name}
              name={agent.name}
              description={agent.description}
              delay={index * 0.2}
              isComplete={completedModules.includes(agent.name)}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Modules */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/5 rounded-xl p-6 border border-white/10 animate-pulse"
          >
            <div className="h-6 w-48 bg-white/10 rounded mb-2" />
            <div className="h-4 w-64 bg-white/10 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
