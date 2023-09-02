"use client";

import { useCallback, useMemo, useState } from "react";

import { Check, Copy, RefreshCw } from "lucide-react";

import useOrigin from "@/hooks/use-origin";
import useModal from "@/hooks/use-modal-store";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

export default function InviteModal() {
  const origin = useOrigin();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const isModalOpen = useMemo(
    () => isOpen && type === "invite",
    [isOpen, type],
  );

  const { server } = useMemo(() => data, [data]);
  const inviteUrl = useMemo(
    () => `${origin}/invite/${server?.inviteCode}`,
    [origin, server?.inviteCode],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [inviteUrl]);

  const handleGenerateNewLink = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );
      onOpen("invite", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [server?.id, onOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          {/* Title. */}
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <section className="p-6">
          {/* Input label. */}
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            {/* Invite link field. */}
            <Input
              value={inviteUrl}
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* Copy button. */}
            <Button onClick={handleCopy} size="icon" disabled={isLoading}>
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* Generate a new link. */}
          <Button
            onClick={handleGenerateNewLink}
            variant="link"
            size="sm"
            disabled={isLoading}
            className="mt-4 text-xs text-zinc-500"
          >
            Generate a new link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
