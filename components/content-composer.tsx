"use client";

import React, { useState } from "react";
import { MyThread } from "@/components/assistant-ui/thread";
import { useAgentContext } from "@/context/agent-context";
import {
  convertLangchainMessages,
  convertToOpenAIFormat,
} from "@/lib/convert-messages";
import {
  AppendMessage,
  AssistantRuntimeProvider,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  TextContentPart,
  useExternalMessageConverter,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import { ChatImageAttachment } from "@/types";
import { converToBase64 } from "@/lib/utils";

export interface ContentComposerChatInterfaceProps {
  chatId: string;
}

export function ContentComposerChatInterfaceComponent({
  chatId,
}: ContentComposerChatInterfaceProps): React.ReactElement {
  const { messages, setMessages, streamMessage } = useAgentContext();
  const [isRunning, setIsRunning] = useState(false);

  async function onNew(message: AppendMessage): Promise<void> {
    const textContent =
      (
        message.content.find((c) => c.type === "text") as
          | TextContentPart
          | undefined
      )?.text || "";

    const imageData = await Promise.all(
      message?.attachments?.map(async (attachment) => {
        const imageFiles = attachment.content
          .filter(
            (item): item is { type: "image"; file: File; image: string } =>
              item.type === "image" && !!attachment.file && !!item.image
          )
          .map(() => attachment.file);

        return Promise.all(
          imageFiles.map(async (file): Promise<ChatImageAttachment> => {
            if (!file) {
              throw new Error("File is undefined");
            }
            const base64Data = await converToBase64(file);
            return {
              base64: base64Data,
              name: file.name,
              type: file.type,
              displayUrl: URL.createObjectURL(file),
            };
          })
        );
      }) ?? []
    );

    const flattenedImages: ChatImageAttachment[] = imageData.flat();

    setIsRunning(true);

    try {
      const humanMessage = new HumanMessage({
        content:
          flattenedImages.length > 0
            ? [
                {
                  type: "text",
                  text: textContent,
                },
                ...flattenedImages.map((image) => ({
                  type: "image_url",
                  image_url: {
                    url: `${image.base64}`,
                  },
                })),
              ].filter(Boolean)
            : textContent,
        id: uuidv4(),
      });

      setMessages((prevMessages) => [...prevMessages, humanMessage]);

      await streamMessage({
        messages: [convertToOpenAIFormat(humanMessage)],
        chatId: chatId,
      });
    } finally {
      setIsRunning(false);
    }
  }

  const threadMessages = useExternalMessageConverter<BaseMessage>({
    callback: convertLangchainMessages,
    messages: messages,
    isRunning,
  });

  const runtime = useExternalStoreRuntime({
    messages: threadMessages,
    isRunning,
    onNew,
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
      ]),
    },
  });

  return (
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <MyThread />
      </AssistantRuntimeProvider>
    </div>
  );
}

export const ContentComposerChatInterface = React.memo(
  ContentComposerChatInterfaceComponent
);
