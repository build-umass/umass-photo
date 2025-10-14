"use client"
import { useEffect, useState } from "react"
import Footer from "../components/footer/footer"
import Navbar from "../components/navbar/navbar"
import UserManagementTab from "./UserManagementTab"
import AdminPageButton from "./AdminPageButton"
import EventManagementTab from "./EventManagementTab"

enum PageState {
    DEFAULT,
    UNAUTHENTICATED,
    AUTHORIZED,
    UNAUTHORIZED
}

enum Tab {
    USER,
    EVENT
}

function getTabValues(): Tab[] {
    return Object.values(Tab).filter(x => typeof x === "number")
}

function getTabName(tab: Tab): string {
    switch (tab) {
        case Tab.USER:
            return "Users"
        case Tab.EVENT:
            return "Events"
    }
}

function AdminPageContent() {
    const [tab, setTab] = useState<Tab>(Tab.USER)
    const currentTab =
        tab == Tab.USER ? <UserManagementTab></UserManagementTab> :
            tab == Tab.EVENT ? <EventManagementTab></EventManagementTab> :
                <div></div>


    return <div className="flex">
        <div className="flex flex-col bg-[#8E122A]">
            {getTabValues().map(tab => {
                return <AdminPageButton key={tab} onClick={() => setTab(tab)}>{getTabName(tab)}</AdminPageButton>
            })}
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