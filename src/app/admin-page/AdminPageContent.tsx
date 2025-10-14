import UserManagementTab from "./UserManagementTab"
import AdminPageButton from "./AdminPageButton"
import EventManagementTab from "./EventManagementTab"
import { useState } from "react"

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
        <div className="flex flex-col bg-[#8E122A]">
            {getTabValues().map(tab => {
                return <AdminPageButton key={tab} onClick={() => setActiveTab(tab)} highlighted={tab == activeTab}>{getTabName(tab)}</AdminPageButton>
            })}
        </div>
        <div>
            {currentTab}
        </div>
    </div>
}
