import { redirect } from "next/navigation";

import { redirectToSignIn } from "@clerk/nextjs";

import ServerSidebar from "@/components/server/server-sidebar";

import db from "@/lib/db";
import currentProfile from "@/lib/current-profile";

interface ServerLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

export default async function ServerLayout({
  children,
  params,
}: ServerLayoutProps) {
  const profile = await currentProfile();
  if (!profile) redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile?.id } },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
