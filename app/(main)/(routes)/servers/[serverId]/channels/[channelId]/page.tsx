import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import { ChannelType } from "@prisma/client";

import MediaRoom from "@/components/media-room";
import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";

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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} isVideo={false} isAudio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} isVideo={true} isAudio={false} />
      )}
    </div>
  );
}
