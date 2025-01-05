"use client";

import type { FC } from "react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ThreadPrimitive } from "@assistant-ui/react";
import { ArrowDownIcon } from "lucide-react";

import { MyComposer, MyEditComposer } from "./composer";
import { MyAssistantMessage, MyUserMessage } from "./messages";
import { MyThreadWelcome } from "./welcome";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";

export const MyThread = () => {
  return (
    <ThreadPrimitive.Root className="h-screen">
      <ThreadPrimitive.Viewport className="flex h-full w-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-10 md:pt-8">
        <MyThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: MyUserMessage,
            EditComposer: MyEditComposer,
            AssistantMessage: MyAssistantMessage,
          }}
        />

        <div className="min-h-8 flex-grow" />

        <div className="sticky bottom-0 mt-4 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4 md:mt-3">
          <ThreadPrimitive.Empty>
            <div className="grid w-full grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <ThreadPrimitive.Suggestion
                className="w-full rounded-xl border min-h-12 p-2 text-sm bg-background shadow-md inner-shadow hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-950"
                prompt="When will the Classes start?"
                method="replace"
                autoSend
              >
                When will the Classes start?
              </ThreadPrimitive.Suggestion>
              <ThreadPrimitive.Suggestion
                className="w-full rounded-xl border p-2 min-h-12 text-sm bg-background shadow-md inner-shadow hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-950"
                prompt="What courses am I enrolled in?"
                method="replace"
                autoSend
              >
                What courses am I enrolled in?
              </ThreadPrimitive.Suggestion>
            </div>
          </ThreadPrimitive.Empty>
          <MyThreadScrollToBottom />
          <MyComposer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const MyThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};
