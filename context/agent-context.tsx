"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { BaseMessage } from "@langchain/core/messages";
import { toast } from "sonner";

import { lgClient } from "@/lib/utils";
import { replaceOrInsertMessageChunk } from "./utils";

interface GraphData {
  runId: string | undefined;
  isStreaming: boolean;
  messages: BaseMessage[];
  firstTokenReceived: boolean;
  setMessages: Dispatch<SetStateAction<BaseMessage[]>>;
  streamMessage: (params: AgentInput) => Promise<void>;
}

const AgentContext = createContext<GraphData | undefined>(undefined);

interface AgentInput {
  chatId: string;
  messages?: Record<string, any>[];
  resume?: string;
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);
  const [runId, setRunId] = useState<string>();

  const streamAgent = async (params: AgentInput) => {
    setFirstTokenReceived(false);
    if (!params.chatId) {
      toast.error("No chatId provided");
      return;
    }

    const client = lgClient();

    const input = {
      messages: params.messages || [],
      resume: params.resume,
    };

    setIsStreaming(true);
    setRunId(undefined);
    // The root level run ID of this stream
    let runId = "";
    let followupMessageId = "";
    // let lastMessage: AIMessage | undefined = undefined;

    try {
      const stream = client.runs.stream(params.chatId, "supervisor_agent", {
        input,
        streamMode: "events",
        config: {
          configurable: {},
        },
      });
      console.log("📡 Stream started");

      for await (const chunk of stream) {
        try {
          if (!runId && chunk.data?.metadata?.run_id) {
            runId = chunk.data.metadata.run_id;
            setRunId(runId);
            console.log("🆔 Run ID set:", runId);
          }

          if (chunk.data.event === "on_chat_model_stream") {
            console.log("📡 Received chat model stream event", chunk.data);
            // These are generating new messages to insert to the chat window.
            if (
              ["generate_response"].includes(chunk.data.metadata.langgraph_node)
            ) {
              const message = chunk.data.data.chunk;
              // Add safety checks
              if (!message) {
                console.log("⚠️ Received empty message in stream chunk");
                continue;
              }

              if (!followupMessageId) {
                followupMessageId = message.id;
                console.log("📝 First message ID:", followupMessageId);
              }
              console.log("📤 Processing message chunk:", {
                id: message.id,
                content: message.content.substring(0, 50) + "...",
              });
              setMessages((prevMessages) =>
                replaceOrInsertMessageChunk(prevMessages, message)
              );
            }
          }
        } catch (e) {
          console.error(
            "Failed to parse stream chunk",
            chunk,
            "\n\nError:\n",
            e
          );
        }
      }
    } catch (e) {
      console.error("Failed to stream message", e);
    } finally {
      setIsStreaming(false);
    }
  };

  const contextValue = {
    runId,
    isStreaming,
    messages,
    firstTokenReceived,
    setMessages,
    streamMessage: streamAgent,
  };

  return (
    <AgentContext.Provider value={contextValue}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgentContext must be used within a GraphProvider");
  }
  return context;
}
