"use client"
import { useEffect, useState } from "react"
import Footer from "../components/footer/footer"
import Navbar from "../components/navbar/navbar"
import AdminPageContent from "./AdminPageContent";

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
            return <>
                <Navbar></Navbar>
                Figuring out who you are...
                <Footer></Footer>
            </>
        case PageState.UNAUTHENTICATED:
            return <>
                <Navbar></Navbar>
                I don&apos;t know who you are
                <Footer></Footer>
            </>
        case PageState.AUTHORIZED:
            return <>
                <Navbar></Navbar>
                <AdminPageContent></AdminPageContent>
                <Footer></Footer>
            </>
        case PageState.UNAUTHORIZED:
            return <>
                <Navbar></Navbar>
                You can&apos;t see this
                <Footer></Footer>
            </>
    }
}