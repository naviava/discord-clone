import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Member, Message, Profile } from "@prisma/client";
import { useSocket } from "@/components/providers/socket-provider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export default function useChatSocket({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // Scoket for message updates.
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return oldData;

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            messages: page.messages.map(
              (item: MessageWithMemberWithProfile) => {
                if (item.id === message.id) return message;
                return item;
              },
            ),
          };
        });
        return { ...oldData, pages: newData };
      });
    });

    // Socket for new messages.
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0)
          return { pages: [{ messages: [message] }] };

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          messages: [message, ...newData[0].messages],
        };

        return { ...oldData, pages: newData };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
}
