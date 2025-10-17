import UserManagementTab from "./UserManagementTab"
import EventManagementTab from "./EventManagementTab"
import { useState } from "react"
import AdminPageTabButton from "./AdminPageTabButton"

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

export default function AdminPageContent() {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.USER)
    const currentTab =
        activeTab == Tab.USER ? <UserManagementTab></UserManagementTab> :
            activeTab == Tab.EVENT ? <EventManagementTab></EventManagementTab> :
                <div></div>


    return <div className="flex">
        <div className="flex flex-col bg-umass-red w-96">
            {getTabValues().map(tab => {
                return <AdminPageTabButton key={tab} onClick={() => setActiveTab(tab)} highlighted={tab == activeTab}>{getTabName(tab)}</AdminPageTabButton>
            })}
        </div>
        <div>
            {currentTab}
        </div>
    </div>
}
