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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseAgentResult(result: { messages: BaseMessage[] }): any {
  try {
    // Convert messages to Vercel-compatible format
    const messages = result.messages.map(
      convertLangChainMessageToVercelMessage,
    );

    // Find the last assistant message
    const lastAssistantMessage = messages
      .reverse()
      .find((m) => m.role === "assistant");

    if (!lastAssistantMessage) {
      console.error("No assistant message found");
      return null;
    }
    let lastAssistantMessageContent = lastAssistantMessage.content as string;
    lastAssistantMessageContent = lastAssistantMessageContent
      .replace("```json", "")
      .replace("```", "")
      .trim();
    // Attempt to parse the content as JSON
    try {
      return JSON.parse(lastAssistantMessageContent);
    } catch (jsonError) {
      // If JSON parsing fails, try to extract JSON from the text
      const jsonMatch = lastAssistantMessageContent.match(/\{[\s\S]*\}/);
      console.error(jsonError);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (nestedJsonError) {
          console.error("Failed to parse nested JSON", nestedJsonError);
          return null;
        }
      }

      console.error(
        "Failed to extract JSON from message",
        lastAssistantMessageContent,
      );
      return null;
    }
  } catch (error) {
    console.error("Error parsing agent result", error);
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
