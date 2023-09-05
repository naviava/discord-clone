"use client";

import { useEffect, useMemo, useState } from "react";

import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import { Channel } from "@prisma/client";

interface MediaRoomProps {
  chatId: string;
  isVideo: boolean;
  isAudio: boolean;
}

export default function MediaRoom({
  chatId,
  isVideo,
  isAudio,
}: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName) return;
    const name = `${user?.firstName} ${user.lastName}`;

    async function fetchToken() {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.log(err);
      }
    }
    fetchToken();
  }, [chatId, user?.firstName, user?.lastName]);

  if (token === "") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={isVideo}
      audio={isAudio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
