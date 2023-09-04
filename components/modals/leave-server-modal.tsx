"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

import useModal from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LeaveServerModal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();

  const { server } = useMemo(() => data, [data]);
  const isModalOpen = useMemo(
    () => isOpen && type === "leaveServer",
    [isOpen, type],
  );

  const handleLeaveServer = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [router, server?.id, onClose]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          {/* Title. */}
          <DialogTitle className="text-center text-2xl font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLeaveServer}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
