import { redirect } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import ThemeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";

import db from "@/lib/db";
import currentProfile from "@/lib/current-profile";

export default async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
  });

  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 py-3 text-primary dark:bg-[#1e1f22]">
      <NavigationAction />
      <Separator className="md mx-auto h-[2px] w-10 rounded bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <section key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </section>
        ))}
      </ScrollArea>
      <section className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ThemeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }}
        />
      </section>
    </div>
  );
}
