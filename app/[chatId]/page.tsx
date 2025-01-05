import { ContentComposerChatInterface } from "@/components/content-composer";

export const dynamic = "force-dynamic";

interface ChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const chatId = (await params).chatId;

  return (
    <div className="h-full flex-grow">
      <ContentComposerChatInterface chatId={chatId} />
    </div>
  );
};

export default ChatPage;
