import { AgentProvider } from "@/context/agent-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="relative flex h-full flex-1 overflow-hidden">
        <AgentProvider>{children}</AgentProvider>
      </div>
    </div>
  );
}
