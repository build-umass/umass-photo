"use client";

import { useEffect } from "react";

// Refresh every 5 seconds for testing
// const REFRESH_MARGIN_MS = 60 * 60 * 1000 - 5 * 1000
// Normal refrsh overlap
const REFRESH_MARGIN_MS = 60 * 1000;

/**
 * This component handles refreshing login sessions.
 * If `loginExpiryTime` is set in local storage, then it waits untl that Unix timestamp to request a
 * refresh from `/api/refresh`.
 */
export default function RefreshHandler() {
  useEffect(() => {
    let stopRefreshLoop = () => {};
    let refreshTimeout = 0;

    const refreshLoop = async () => {
      let doRefreshLoop = true;
      while (doRefreshLoop) {
        const loginExpiryTime = localStorage.getItem("loginExpiryTime");
        if (loginExpiryTime === null) break;
        const millisUntilRefresh =
          parseInt(loginExpiryTime) - Date.now() - REFRESH_MARGIN_MS;

        const shouldBreak = await new Promise<boolean>((res) => {
          const resumeRefreshLoop = () => {
            res(false);
          };
          stopRefreshLoop = () => {
            doRefreshLoop = false;
            res(true);
          };
          refreshTimeout = window.setTimeout(
            resumeRefreshLoop,
            millisUntilRefresh,
          );
        });
        stopRefreshLoop = () => {
          doRefreshLoop = false;
        };
        refreshTimeout = 0;

        if (shouldBreak) break;

        try {
          const response = await fetch("/api/refresh", { method: "POST" });
          if (!response.ok)
            throw new Error(
              `Failed to refresh: ${response.status} ${response.statusText}`,
            );
          const { expires_at: newATExpiryTime } = await response.json();
          if (typeof newATExpiryTime !== "number")
            throw new Error(`Invalid expiry time: ${newATExpiryTime}`);
          if (newATExpiryTime * 1000 - Date.now() <= REFRESH_MARGIN_MS)
            throw new Error(`Expiry time too close: ${newATExpiryTime}`);
          localStorage.setItem(
            "loginExpiryTime",
            (newATExpiryTime * 1000).toString(),
          );
        } catch (e) {
          console.error("Error refreshing session: ", e);
          break;
        }
      }
    };
    refreshLoop();
    return () => {
      stopRefreshLoop();
      clearTimeout(refreshTimeout);
    };
  }, []);
  return <></>;
}
