import { redirect } from "next/navigation";
import { lgClient } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const client = await lgClient();
  if (!client) return null;

  const thread = await client.threads.create({
    metadata: { user_id: "user_123" },
  });

  if (thread) {
    redirect(`/chat/${thread.thread_id}`);
  }

  return <div>Hello World</div>;
}
