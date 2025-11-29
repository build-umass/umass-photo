'use client'

import { useEffect } from "react"

// Refresh every 5 seconds for testing
// const REFRESH_MARGIN_MS = 3595000
const REFRESH_MARGIN_MS = 60000

export default function RefreshHandler() {
    useEffect(() => {
        let refreshTimeout = 0;
        let breakRefreshHook = () => {};
        const refreshTask = async () => {
            while (true) {
                const loginExpiryTime = localStorage.getItem("loginExpiryTime")
                if (loginExpiryTime === null) return;
                await new Promise<boolean>(res => {
                    const resumeRefreshLoop = () => {res(true)}
                    const breakRefreshLoop = () => {res(true)}
                    breakRefreshHook = breakRefreshLoop
                    const millisUntilRefresh = parseInt(loginExpiryTime) - Date.now() - REFRESH_MARGIN_MS
                    refreshTimeout = window.setTimeout(resumeRefreshLoop, millisUntilRefresh)
                })
                breakRefreshHook = () => {};
                refreshTimeout = 0;
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