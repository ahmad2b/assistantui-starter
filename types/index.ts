import { BaseMessage } from "@langchain/core/messages";

export interface Result<T> {
  type: "success" | "error";
  message: string;
  data?: T;
}

export interface Thread {
  threadId: string;
  createdAt: string;
  updatedAt: string;
  messages: BaseMessage[];
  metadata?: {
    user_id: string;
  };
}

export interface ThreadMessage {
  id: string;
  type: "human" | "ai";
  content: string;
  createdAt: string;
}

export type ThreadGroup = {
  today: Thread[];
  yesterday: Thread[];
  thisWeek: Thread[];
  older: Thread[];
};

export interface CustomQuickAction {
  id: string;
  title: string;
  prompt: string;
  includeReflections: boolean;
  includePrefix: boolean;
  includeRecentHistory: boolean;
}

export interface Reflections {
  /**
   * Style rules to follow for generating content.
   */
  styleRules: string[];
  /**
   * Key content to remember about the user when generating content.
   */
  content: string[];
}

export type ActionResult = {
  success?: string;
  error?: string;
};

export type ChatImageAttachment = {
  base64: string;
  name: string;
  type: string;
  displayUrl: string;
};
