"use client"

import { useEffect, useState } from "react";
import AuthorizedPage from "./AuthorizedPage";

enum PageState {
    DEFAULT,
    UNAUTHENTICATED,
    AUTHORIZED,
    UNAUTHORIZED
}
export default function AdminPage() {
    const [pageState, setPageState] = useState<PageState>(PageState.DEFAULT);
    useEffect(
        () => {
            (async () => {
                const response = await fetch("/api/get-role");
                if (!response.ok) {
                    setPageState(PageState.UNAUTHENTICATED);
                    return;
                }
                const myRoleData = await response.json();
                if (myRoleData["is_admin"]) {
                    setPageState(PageState.AUTHORIZED);
                    return;
                } else {
                    setPageState(PageState.UNAUTHORIZED);
                    return;
                }
            })();
        },
        []
    )
    switch (pageState) {
        case PageState.DEFAULT:
            return <div>Figuring out who you are...</div>
        case PageState.UNAUTHENTICATED:
            return <div>I don&apost know who you are</div>
        case PageState.AUTHORIZED:
            return <AuthorizedPage></AuthorizedPage>
        case PageState.UNAUTHORIZED:
            return <div>You can&apost see this</div>
    }
}