"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import qs from "query-string";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import useModal from "@/hooks/use-modal-store";

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";

import UserAvatar from "@/components/user-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export default function MembersModal() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const isModalOpen = useMemo(
    () => isOpen && type === "members",
    [isOpen, type],
  );

  const { server } = useMemo(
    () => data as { server: ServerWithMembersWithProfiles },
    [data],
  );

  const onKickMember = useCallback(
    async (memberId: string) => {
      try {
        setLoadingId(memberId);

        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: { serverId: server?.id },
        });

        const response = await axios.delete(url);

        router.refresh();
        onOpen("members", { server: response.data });
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingId("");
      }
    },
    [server?.id, router, onOpen],
  );

  const onRoleChange = useCallback(
    async (memberId: string, role: MemberRole) => {
      try {
        setLoadingId(memberId);
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: { serverId: server?.id },
        });

        const response = await axios.patch(url, { role });

        router.refresh();
        onOpen("members", { server: response.data });
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingId("");
      }
    },
    [server?.id, router, onOpen],
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          {/* Title. */}
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          {/* Number of members. */}
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            // Members section.
            <section key={member.id} className="mb-6 flex items-center gap-x-2">
              {/* Avatar. */}
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                {/* Name ane role icon. */}
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                {/* Email address. */}
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    {/* Server membership modification actions. */}
                    <DropdownMenu>
                      {/* Actions trigger button. */}
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          {/* Role. */}
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 h-4 w-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {/* Guest role option. */}
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="ml-auto h-4 w-4 text-emerald-500" />
                                )}
                              </DropdownMenuItem>
                              {/* Moderator role option. */}
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                                className="text-indigo-500"
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="ml-auto h-4 w-4 text-emerald-500" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        {/* Kick member option. */}
                        <DropdownMenuItem
                          onClick={() => onKickMember(member.id)}
                          className="text-rose-500"
                        >
                          <Gavel className="mr-2 h-4 w-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </section>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
