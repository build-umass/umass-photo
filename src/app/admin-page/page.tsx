"use client"
import { useEffect, useState } from "react"
import Footer from "../components/footer/footer"
import Navbar from "../components/navbar/navbar"
import UserManagementTab from "./UserManagementTab"
import AdminPageButton from "./AdminPageButton"

enum PageState {
    DEFAULT,
    UNAUTHENTICATED,
    AUTHORIZED,
    UNAUTHORIZED
}

function EventManagementTab() {
    return <>event</>
}

enum Tab {
    USER,
    EVENT
}

function AdminPageContent() {
    const [tab, setTab] = useState<Tab>(Tab.USER)
    const currentTab =
        tab == Tab.USER ? <UserManagementTab></UserManagementTab> :
            tab == Tab.EVENT ? <EventManagementTab></EventManagementTab> :
                <div></div>

    return <div>
        <div>
            <AdminPageButton onClick={() => setTab(Tab.USER)}>Users</AdminPageButton>
            <AdminPageButton onClick={() => setTab(Tab.EVENT)}>Events</AdminPageButton>
        </div>
        <div>
            {currentTab}
        </div>
    </div>
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