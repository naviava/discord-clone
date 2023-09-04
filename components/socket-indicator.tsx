"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";

interface SocketIndicatorProps {}

export default function SocketIndicator({}: SocketIndicatorProps) {
  const { isConnected } = useSocket();

  if (!isConnected)
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        Fallback: Polling every 1s
      </Badge>
    );

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      Live: Real-time updates
    </Badge>
  );
}
