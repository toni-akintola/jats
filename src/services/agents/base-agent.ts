import { MistralAI } from "@langchain/mistralai";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda, RunnableConfig } from "@langchain/core/runnables";
import { AgentMessage, SourceData } from "../agent-types";

export interface SearchTool {
  name: string;
  description: string;
  batch: (
    toolCalls: Array<{ name: string; arguments: string }>,
    config?: RunnableConfig,
  ) => Promise<BaseMessage[]>;
}

export interface AgentResult {
  content: string;
  toolCalls?: Array<{ name: string; arguments: string }>;
}

export abstract class BaseAgent {
  protected llm: MistralAI;
  protected sourceName: string;
  protected searchTool: SearchTool;
  private chain: ReturnType<typeof ChatPromptTemplate.prototype.pipe>;

  constructor(sourceName: string, searchTool: SearchTool) {
    this.llm = new MistralAI({
      model: "codestral-latest",
      temperature: 0,
      maxRetries: 2,
    });
    this.sourceName = sourceName;
    this.searchTool = searchTool;
    this.chain = this.createChain();
  }

  private createChain() {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a sentiment analysis agent specialized in analyzing ${this.sourceName} content.`,
      ],
      ["placeholder", "{messages}"],
    ]);

    return prompt.pipe(this.llm);
  }

  protected createToolChain() {
    return RunnableLambda.from(
      async (userInput: string, config?: RunnableConfig) => {
        const humanMessage = new HumanMessage(userInput);

        const aiMsg = await this.chain.invoke(
          {
            messages: [new HumanMessage(userInput)],
          },
          config,
        );

        const toolMsgs = await this.searchTool.batch(
          aiMsg.tool_calls || [],
          config,
        );

        return this.chain.invoke(
          {
            messages: [humanMessage, aiMsg, ...toolMsgs],
          },
          config,
        );
      },
    );
  }

  abstract formatResponse(result: AgentResult): Promise<SourceData>;

  async search(company: string): Promise<AgentMessage> {
    try {
      const toolChain = this.createToolChain();
      const result = await toolChain.invoke(
        `Find and analyze sentiment for ${company} on ${this.sourceName}`,
      );
      const formattedData = await this.formatResponse(result);

      return {
        type: "source_complete",
        source: this.sourceName,
        data: formattedData,
      };
    } catch (error) {
      console.error(`${this.sourceName} agent error:`, error);
      return {
        type: "source_error",
        source: this.sourceName,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
