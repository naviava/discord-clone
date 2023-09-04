"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data: { icon: React.ReactNode; name: string; id: string }[] | undefined;
  }[];
}

export default function ServerSearch({ data }: ServerSearchProps) {
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onSearchShortcut(evt: KeyboardEvent) {
      if (evt.key === "k" && (evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onSearchShortcut);
    return () => document.removeEventListener("keydown", onSearchShortcut);
  }, []);

  const handleClick = useCallback(
    ({ id, type }: { id: string; type: "channel" | "member" }) => {
      setIsOpen(false);

      if (type === "member")
        return router.push(`/servers/${params?.serverId}/conversations/${id}`);
      if (type === "channel")
        return router.push(`/servers/${params?.serverId}/channels/${id}`);
    },
    [router, params?.serverId],
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
      >
        <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <p className="dark:dark-hover:text-zinc-300 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400">
          Search
        </p>
        <kbd className="text-mono pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">Ctrl</span> + K
        </kbd>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => handleClick({ id, type })}
                  >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
