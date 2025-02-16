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
  // For LangChain responses, the content is in result.content

  let content = result.messages[result.messages.length - 1].content;
  console.log("content", content);
  content = content
    .toString()
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();
  console.log("content", content);
  try {
    return JSON.parse(content);
  } catch (e) {
    console.log("Failed to parse agent result:", e);
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

// Array of apartment image paths
const APARTMENT_IMAGES = Array.from({ length: 19 }, (_, i) => `/${i + 1}.jpg`);

export function getRandomApartmentImage(): string {
  const randomIndex = Math.floor(Math.random() * APARTMENT_IMAGES.length);
  return APARTMENT_IMAGES[randomIndex];
}
