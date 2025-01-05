import { useEffect, useState } from "react";
import Image from "next/image";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionBarPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { motion } from "framer-motion";
import {
  AudioLinesIcon,
  CheckIcon,
  CopyIcon,
  RefreshCwIcon,
  StopCircleIcon,
} from "lucide-react";

import { MyBranchPicker } from "../branch-picker";

const loadingMessages = [
  "Reading your question...",
  "Looking through the material...",
  "Finding the best way to help...",
  "Checking my notes...",
  "Getting your answer ready...",
];

export const MyAssistantMessage = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
        <AvatarFallback className="bg-background">
          <Image
            src={"/logos/logoIcon.webp"}
            alt="Panaversity"
            width={240}
            height={240}
            className=""
          />
        </AvatarFallback>
      </Avatar>

      <div className="col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7 text-foreground">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
        <MessagePrimitive.If hasContent={false}>
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 text-muted-foreground"
          >
            <p className="text-sm font-medium">
              {loadingMessages[messageIndex]}
            </p>
            <div className="flex space-x-1">
              <span className="animate-bounce">·</span>
              <span className="animate-bounce delay-100">·</span>
              <span className="animate-bounce delay-200">·</span>
            </div>
          </motion.div>
        </MessagePrimitive.If>
      </div>

      <MyAssistantActionBar />

      <MyBranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const MyAssistantActionBar = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:bg-background data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <MessagePrimitive.If speaking={false}>
        <ActionBarPrimitive.Speak asChild>
          <TooltipIconButton tooltip="Read aloud">
            <AudioLinesIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.Speak>
      </MessagePrimitive.If>
      <MessagePrimitive.If speaking>
        <ActionBarPrimitive.StopSpeaking asChild>
          <TooltipIconButton tooltip="Stop">
            <StopCircleIcon />
          </TooltipIconButton>
        </ActionBarPrimitive.StopSpeaking>
      </MessagePrimitive.If>
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};
