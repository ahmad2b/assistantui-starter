import {
  ImageContentPart,
  TextContentPart,
  ThreadMessageLike,
  ToolCallContentPart,
  useExternalMessageConverter,
} from "@assistant-ui/react";
import { AIMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";

// Not exposed by `@assistant-ui/react` package, but is
// the required return type for this callback function.
type Message =
  | ThreadMessageLike
  | {
      role: "tool";
      toolCallId: string;
      toolName?: string | undefined;
      result: any;
    };

export const getMessageType = (message: Record<string, any>): string => {
  if ("getType" in message && typeof message.getType === "function") {
    return message.getType();
  } else if ("_getType" in message && typeof message._getType === "function") {
    return message._getType();
  } else if ("type" in message) {
    return message.type as string;
  } else {
    throw new Error("Unsupported message type");
  }
};

export const oldConvertLangchainMessages: useExternalMessageConverter.Callback<
  BaseMessage
> = (message): Message | Message[] => {
  if (typeof message?.content !== "string") {
    throw new Error("Only text messages are supported");
  }

  switch (getMessageType(message)) {
    case "system":
      return {
        role: "system",
        id: message.id,
        content: [{ type: "text", text: message.content }],
      };
    case "human":
      return {
        role: "user",
        id: message.id,
        content: [{ type: "text", text: message.content }],
      };
    case "ai":
      const aiMsg = message as AIMessage;
      const toolCallsContent: ToolCallContentPart[] = aiMsg.tool_calls?.length
        ? aiMsg.tool_calls.map((tc) => ({
            type: "tool-call" as const,
            toolCallId: tc.id ?? "",
            toolName: tc.name,
            args: tc.args,
            argsText: JSON.stringify(tc.args),
          }))
        : [];
      return {
        role: "assistant",
        id: message.id,
        content: [
          ...toolCallsContent,
          {
            type: "text",
            text: message.content,
          },
        ],
      };
    case "tool":
      return {
        role: "tool",
        toolName: message.name,
        toolCallId: (message as ToolMessage).tool_call_id,
        result: message.content,
      };
    default:
      throw new Error(`Unsupported message type: ${getMessageType(message)}`);
  }
};

export const convertLangchainMessages: useExternalMessageConverter.Callback<
  BaseMessage
> = (message): Message | Message[] => {
  // Handle array content (text + images)
  if (Array.isArray(message.content)) {
    const content = message.content.map((item) => {
      if (item.type === "text") {
        return { type: "text", text: item.text as string } as TextContentPart;
      }
      if (item.type === "image_url") {
        return {
          type: "image",
          image: item.image_url.url,
        } satisfies ImageContentPart;
      }
      console.log("Unsupported content type", item);
      throw new Error(`Unsupported content type: ${item.type}`);
    });

    switch (getMessageType(message)) {
      case "system":
        return {
          role: "system",
          id: message.id,
          content,
        };
      case "human":
        return {
          role: "user",
          id: message.id,
          content,
        };
      case "ai":
        const aiMsg = message as AIMessage;
        const toolCallsContent: ToolCallContentPart[] = aiMsg.tool_calls?.length
          ? aiMsg.tool_calls.map((tc) => ({
              type: "tool-call" as const,
              toolCallId: tc.id ?? "",
              toolName: tc.name,
              args: tc.args,
              argsText: JSON.stringify(tc.args),
            }))
          : [];
        return {
          role: "assistant",
          id: message.id,
          content: [...toolCallsContent, ...content],
        };
      case "tool":
        return {
          role: "tool",
          toolName: message.name,
          toolCallId: (message as ToolMessage).tool_call_id,
          result: content,
        };
      default:
        throw new Error(`Unsupported message type: ${getMessageType(message)}`);
    }
  }

  // Handle string content (backwards compatibility)
  if (typeof message.content === "string") {
    return oldConvertLangchainMessages(message);
  }

  throw new Error("Unsupported message content format");
};

export function oldConvertToOpenAIFormat(message: BaseMessage) {
  if (typeof message?.content !== "string") {
    throw new Error("Only text messages are supported");
  }
  switch (getMessageType(message)) {
    case "system":
      return {
        role: "system",
        content: message.content,
      };
    case "human":
      return {
        role: "user",
        content: message.content,
      };
    case "ai":
      return {
        role: "assistant",
        content: message.content,
      };
    case "tool":
      return {
        role: "tool",
        toolName: message.name,
        result: message.content,
      };
    default:
      throw new Error(`Unsupported message type: ${getMessageType(message)}`);
  }
}
export function convertToOpenAIFormat(message: BaseMessage) {
  if (Array.isArray(message.content)) {
    const content = message.content.map((item) => {
      if (item.type === "text") {
        return { type: "text", text: item.text };
      }
      if (item.type === "image_url") {
        return { type: "image_url", image_url: { url: item.image_url.url } };
      }
      throw new Error(`Unsupported content type: ${item.type}`);
    });

    switch (getMessageType(message)) {
      case "system":
        return {
          role: "system",
          content,
        };
      case "human":
        return {
          role: "user",
          content,
        };
      case "ai":
        return {
          role: "assistant",
          content,
        };
      case "tool":
        return {
          role: "tool",
          toolName: message.name,
          result: content,
        };
      default:
        throw new Error(`Unsupported message type: ${getMessageType(message)}`);
    }
  }

  if (typeof message.content === "string") {
    return oldConvertToOpenAIFormat(message);
  }

  throw new Error("Unsupported message content format");
}
