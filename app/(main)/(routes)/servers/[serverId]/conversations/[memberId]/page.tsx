import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import MediaRoom from "@/components/media-room";
import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";

import db from "@/lib/db";
import currentProfile from "@/lib/current-profile";
import fetchConversation from "@/lib/fetchConversation";

interface ConversationPageProps {
  params: { memberId: string; serverId: string };
  searchParams: { video?: boolean };
}

export default async function ConversationPage({
  params,
  searchParams,
}: ConversationPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) return redirect("/");

  const conversation = await fetchConversation(
    currentMember.id,
    params.memberId,
  );
  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} isVideo={true} isAudio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{ conversationId: conversation.id }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
}
