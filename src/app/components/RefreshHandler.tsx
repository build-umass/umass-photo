'use client'

import { useEffect } from "react"

// Refresh every 5 seconds for testing
// const REFRESH_MARGIN_MS = 3595000
const REFRESH_MARGIN_MS = 60000

export default function RefreshHandler() {
    useEffect(() => {
        let breakRefreshHook = () => {};
        let refreshTimeout = 0;

        const refreshTask = async () => {
            while (true) {
                const loginExpiryTime = localStorage.getItem("loginExpiryTime")
                if (loginExpiryTime === null) return;
                const millisUntilRefresh = parseInt(loginExpiryTime) - Date.now() - REFRESH_MARGIN_MS

                const shouldBreak = await new Promise<boolean>(res => {
                    const resumeRefreshLoop = () => {res(false)}
                    const breakRefreshLoop = () => {res(true)}
                    breakRefreshHook = breakRefreshLoop
                    refreshTimeout = window.setTimeout(resumeRefreshLoop, millisUntilRefresh)
                })
                breakRefreshHook = () => {};
                refreshTimeout = 0;

                if (shouldBreak) break;

                const response = await fetch("/api/refresh", { method: "POST" });
                const expiry = await response.json();
                localStorage.setItem("loginExpiryTime", (expiry.expires_at * 1000).toString())
            }
        }
        refreshTask();
        return () => {
            breakRefreshHook()
            clearTimeout(refreshTimeout)
        }
    }, [])
    return <></>
}