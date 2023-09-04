import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";

import db from "@/lib/db";
import currentProfile from "@/lib/current-profile";

interface ChannelPageProps {
  params: { serverId: string; channelId: string };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1">Messages</div>
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: channel.serverId }}
      />
    </div>
  );
}
