import { MouseEventHandler, useCallback } from "react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import {
  AttachmentPrimitive,
  ComposerPrimitive,
  ThreadPrimitive,
  useComposer,
  useComposerRuntime,
} from "@assistant-ui/react";
import { CircleStopIcon, ImageIcon, SendHorizontalIcon, X } from "lucide-react";

const useCustomAddAttachment = () => {
  const disabled = useComposer((c) => !c.isEditing);
  const composerRuntime = useComposerRuntime();

  const callback: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true; // Enable multiple file selection

      const attachmentAccept = composerRuntime.getAttachmentAccept();
      input.accept = attachmentAccept !== "*" ? attachmentAccept : "image/*";

      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          Array.from(files).forEach((file) => {
            composerRuntime.addAttachment(file);
          });
        }
      };

      input.click();
    },
    [composerRuntime]
  );

  return disabled ? undefined : callback;
};

const MyImageAttachmentComponent = () => (
  <AttachmentPrimitive.Root className="relative flex h-20 min-w-20 flex-col items-center gap-2 rounded-xl border p-2 text-xs">
    <AttachmentPrimitive.unstable_Thumb className="flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-500" />
    <AttachmentPrimitive.Name />
    <AttachmentPrimitive.Remove className="absolute -right-2 -top-2 rounded-full border bg-white p-0.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
      <X className="size-3" />
    </AttachmentPrimitive.Remove>
  </AttachmentPrimitive.Root>
);

export const MyComposer = () => {
  const handleAddAttachment = useCustomAddAttachment();

  return (
    <ComposerPrimitive.Root className="flex w-full flex-col">
      <div className="mb-2 flex gap-2 overflow-x-auto p-2">
        <ComposerPrimitive.Attachments
          components={{
            Image: MyImageAttachmentComponent,
          }}
        />
      </div>
      <div className="flex w-full flex-wrap items-end rounded-2xl border bg-white px-2.5 shadow-sm transition-colors ease-in focus-within:border-aui-ring/20 dark:bg-gray-950">
        <ComposerPrimitive.AddAttachment
          asChild
          className="bg-white dark:bg-gray-950"
        >
          <TooltipIconButton
            tooltip="Upload image"
            variant="ghost"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
            onClick={handleAddAttachment}
          >
            <ImageIcon className="size-5" />
          </TooltipIconButton>
        </ComposerPrimitive.AddAttachment>
        <ComposerPrimitive.Input
          autoFocus
          placeholder="Write a message..."
          rows={1}
          className="max-h-40 flex-grow resize-none border-none bg-white px-2 py-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-0 disabled:cursor-not-allowed dark:bg-gray-950"
        />
        <ThreadPrimitive.If running={false}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip="Send"
              variant="default"
              className="my-2.5 size-8 p-2 transition-opacity ease-in"
            >
              <SendHorizontalIcon />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </ThreadPrimitive.If>
        <ThreadPrimitive.If running>
          <ComposerPrimitive.Cancel asChild>
            <TooltipIconButton
              tooltip="Cancel"
              variant="default"
              className="my-2.5 size-8 p-2 transition-opacity ease-in"
            >
              <CircleStopIcon fill="white" />
            </TooltipIconButton>
          </ComposerPrimitive.Cancel>
        </ThreadPrimitive.If>
      </div>
    </ComposerPrimitive.Root>
  );
};

export const MyEditComposer = () => {
  return (
    <ComposerPrimitive.Root className="my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl bg-muted">
      <ComposerPrimitive.Input className="flex h-8 w-full resize-none border-none bg-transparent p-4 pb-0 text-foreground outline-none focus:ring-0" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};
