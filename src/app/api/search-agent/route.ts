import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage } from "ai";

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { Calculator } from "@langchain/community/tools/calculator";
import {
  AIMessage,
  BaseMessage,
  SystemMessage,
} from "@langchain/core/messages";

export const runtime = "edge";

// const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
//   if (message.role === "user") {
//     return new HumanMessage(message.content);
//   } else if (message.role === "assistant") {
//     return new AIMessage(message.content);
//   } else {
//     return new ChatMessage(message.content, message.role);
//   }
// };

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

const AGENT_SYSTEM_TEMPLATE = `You are a talking parrot named Polly. All final responses must be how a talking parrot would respond. Squawk often!`;

/**
 * This handler initializes and calls an tool caling ReAct agent.
 * See the docs for more information:
 *
 * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;

    // Ensure messages is always an array and has the correct format
    const messages = ((body.messages ?? []) as VercelChatMessage[])
      .filter(
        (message) => message.role === "user" || message.role === "assistant",
      )
      .map((message) => ({
        role: message.role,
        content: message.content || "", // Ensure content is never undefined
      }));

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "At least one message is required" },
        { status: 400 },
      );
    }

    // Requires process.env.SERPAPI_API_KEY to be set: https://serpapi.com/
    // You can remove this or use a different tool instead.
    const tools = [new Calculator(), new TavilySearchResults()];
    const chat = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    /**
     * Use a prebuilt LangGraph agent.
     */
    const agent = createReactAgent({
      llm: chat,
      tools,
      /**
       * Modify the stock prompt in the prebuilt agent. See docs
       * for how to customize your agent:
       *
       * https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
       */
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    if (!returnIntermediateSteps) {
      /**
       * Stream back all generated tokens and steps from their runs.
       *
       * We do some filtering of the generated events and only stream back
       * the final response as a string.
       *
       * For this specific type of tool calling ReAct agents with OpenAI, we can tell when
       * the agent is ready to stream back final output when it no longer calls
       * a tool and instead streams back content.
       *
       * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
       */
      const eventStream = await agent.streamEvents(
        { messages },
        { version: "v2" },
      );

      return new Response(
        new ReadableStream({
          async start(controller) {
            const textEncoder = new TextEncoder();
            for await (const { event, data } of eventStream) {
              if (event === "on_chat_model_stream" && data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
            controller.close();
          },
        }),
      );
    } else {
      /**
       * We could also pick intermediate steps out from `streamEvents` chunks, but
       * they are generated as JSON objects, so streaming and displaying them with
       * the AI SDK is more complicated.
       */
      const result = await agent.invoke({ messages });
      const res = result.messages.map(convertLangChainMessageToVercelMessage);
      return NextResponse.json(
        {
          result: res[res.length - 1].content,
        },
        { status: 200 },
      );
    }
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "An unknown error occurred" },
      {
        status:
          e instanceof Error && "status" in e
            ? ((e as Error & { status?: number }).status ?? 500)
            : 500,
      },
    );
  }
}
