"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { Video, VideoOff } from "lucide-react";

import ActionTooltip from "@/components/action-tooltip";

export default function ChatVideoButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = useMemo(() => searchParams?.get("video"), [searchParams]);
  const Icon = useMemo(() => (isVideo ? VideoOff : Video), [isVideo]);
  const tooltipLabel = useMemo(
    () => (isVideo ? "End call" : "Start video call"),
    [isVideo],
  );

  function handleClick() {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: { video: isVideo ? undefined : true },
      },
      { skipNull: true },
    );

    router.push(url);
  }

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        onClick={handleClick}
        className="mr-4 transition hover:opacity-75"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
}
