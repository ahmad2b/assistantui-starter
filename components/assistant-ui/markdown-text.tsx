"use client";

import { FC, memo, useState } from "react";
import { SyntaxHighlighter } from "@/components/assistant-ui/syntax-highlighter";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";
import {
  CodeHeaderProps,
  MarkdownTextPrimitive,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import { CheckIcon, CopyIcon } from "lucide-react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

// Custom component to handle YouTube links
const YouTubeEmbed: FC<{ url: string }> = ({ url }) => {
  const videoId = url.split("v=")[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="youtube-embed my-4">
      <div className="relative h-0 overflow-hidden rounded-lg pb-[56.25%]">
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        h1: ({ node: _node, className, ...props }) => (
          <h1
            className={cn(
              "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
              className
            )}
            {...props}
          />
        ),
        h2: ({ node: _node, className, ...props }) => (
          <h2
            className={cn(
              "mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props}
          />
        ),
        h3: ({ node: _node, className, ...props }) => (
          <h3
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props}
          />
        ),
        h4: ({ node: _node, className, ...props }) => (
          <h4
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className
            )}
            {...props}
          />
        ),
        h5: ({ node: _node, className, ...props }) => (
          <h5
            className={cn(
              "my-4 text-lg font-semibold first:mt-0 last:mb-0",
              className
            )}
            {...props}
          />
        ),
        h6: ({ node: _node, className, ...props }) => (
          <h6
            className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
            {...props}
          />
        ),
        p: ({ node: _node, className, ...props }) => (
          <p
            className={cn(
              "mb-5 mt-5 leading-7 first:mt-0 last:mb-0",
              className
            )}
            {...props}
          />
        ),
        a: ({ node: _node, className, ...props }) => {
          const url = props.href || "";
          if (url.includes("youtube.com/watch")) {
            return <YouTubeEmbed url={url} />;
          }
          return (
            <a
              target="_blank"
              className={cn(
                "font-medium text-primary underline underline-offset-4",
                className
              )}
              {...props}
            />
          );
        },
        blockquote: ({ node: _node, className, ...props }) => (
          <blockquote
            className={cn("border-l-2 pl-6 italic", className)}
            {...props}
          />
        ),
        ul: ({ node: _node, className, ...props }) => (
          <ul
            className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
            {...props}
          />
        ),
        ol: ({ node: _node, className, ...props }) => (
          <ol
            className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
            {...props}
          />
        ),
        hr: ({ node: _node, className, ...props }) => (
          <hr className={cn("my-5 border-b", className)} {...props} />
        ),
        table: ({ node: _node, className, ...props }) => (
          <table
            className={cn(
              "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
              className
            )}
            {...props}
          />
        ),
        th: ({ node: _node, className, ...props }) => (
          <th
            className={cn(
              "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
              className
            )}
            {...props}
          />
        ),
        td: ({ node: _node, className, ...props }) => (
          <td
            className={cn(
              "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
              className
            )}
            {...props}
          />
        ),
        tr: ({ node: _node, className, ...props }) => (
          <tr
            className={cn(
              "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
              className
            )}
            {...props}
          />
        ),
        sup: ({ node: _node, className, ...props }) => (
          <sup
            className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
            {...props}
          />
        ),
        pre: ({ node: _node, className, ...props }) => (
          <pre
            className={cn(
              "overflow-x-auto rounded-b-lg bg-black p-4 text-white",
              className
            )}
            {...props}
          />
        ),
        code: function Code({ node: _node, className, ...props }) {
          const isCodeBlock = useIsMarkdownCodeBlock();
          return (
            <code
              className={cn(
                !isCodeBlock && "rounded border bg-aui-muted font-semibold",
                className
              )}
              {...props}
            />
          );
        },
        CodeHeader,
        SyntaxHighlighter,
      }}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};
