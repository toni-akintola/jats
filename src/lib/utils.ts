import { BaseMessage } from "@langchain/core/messages";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertLangChainMessageToVercelMessage(message: BaseMessage) {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tool_calls: (message as any).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
}

export function parseAgentResult(result: any) {
  const regex = /{[\s\S]*}/;
  const match = result.output.match(regex);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("Failed to parse agent result:", e);
    return null;
  }
}

// Optional: Add a type-safe version for specific module results
export function parseModuleResult<T>(
  result: { messages: BaseMessage[] },
  defaultValue: T,
): T {
  const parsedResult = parseAgentResult(result);
  return parsedResult || defaultValue;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
