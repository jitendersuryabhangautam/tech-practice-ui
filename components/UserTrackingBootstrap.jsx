"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackPageView } from "@/lib/userTracking";

export default function UserTrackingBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("session_start");
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
