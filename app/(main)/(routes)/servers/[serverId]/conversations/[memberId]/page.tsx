import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import db from "@/lib/db";
import currentProfile from "@/lib/current-profile";
import fetchConversation from "@/lib/fetchConversation";
import ChatHeader from "@/components/chat/chat-header";

interface ConversationPageProps {
  params: { memberId: string; serverId: string };
}

export default async function ConversationPage({
  params,
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
    </div>
  );
}