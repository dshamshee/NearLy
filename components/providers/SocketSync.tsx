"use client";

import { useEffect } from "react";
import { useSocket } from "@/utils/socketContext";
import { useWorkerStore } from "@/store/useWorkerStore";

export const SocketSync = () => {
  const { socket, isConnected } = useSocket();
  const initSocketListeners = useWorkerStore((s) => s.initSocketListeners);
  const cleanupListeners = useWorkerStore((s) => s.cleanupListeners);

  useEffect(() => {
    if (socket && isConnected) {
      initSocketListeners(socket);
    }

    return () => {
      if (socket) cleanupListeners(socket);
    };
  }, [socket, isConnected, initSocketListeners, cleanupListeners]);

  return null;
};
