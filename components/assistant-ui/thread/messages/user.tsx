import {
  ActionBarPrimitive,
  AttachmentPrimitive,
  MessagePrimitive,
} from "@assistant-ui/react";

import { MarkdownText } from "../../markdown-text";
import { MyBranchPicker } from "../branch-picker";

export const MyUserMessage = () => {
  return (
    <MessagePrimitive.Root className="bottom-4 mt-auto grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4 sm:gap-y-6 sm:py-6">
      <MyUserActionBar />

      <div className="col-start-2 row-start-1 flex flex-col gap-4">
        <div className="max-w-xl break-words rounded-3xl bg-muted px-5 py-2.5 text-foreground">
          <MessagePrimitive.Content components={{ Text: MarkdownText }} />
        </div>

        <MessagePrimitive.Attachments
          components={{
            Attachment: UserMessageAttachment,
          }}
        />
      </div>

      <MyBranchPicker className="col-span-full col-start-1 row-start-2 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserMessageAttachment = () => {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm">
      <AttachmentPrimitive.unstable_Thumb className="h-auto w-full object-cover" />
      <div className="bg-gray-100 p-2">
        <p className="text-sm font-medium">
          <AttachmentPrimitive.Name />
        </p>
        <p className="text-xs text-gray-500">
          <AttachmentPrimitive.Root />
        </p>
      </div>
    </div>
  );
};

const MyUserActionBar = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 mr-3 mt-2.5 flex flex-col items-end"
    >
      {/* <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit> */}
    </ActionBarPrimitive.Root>
  );
};
