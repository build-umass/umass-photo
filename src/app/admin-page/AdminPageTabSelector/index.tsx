import { ReactNode } from "react";
import EventManagementTab from "../EventManagementTab";
import UserManagementTab from "../UserManagementTab";
import AdminPageTabButton from "./AdminPageTabButton";

export type TabInfo = Readonly<{
    title: string;
    component: () => ReactNode;
}>;

export const userTab = { title: "Users", component: UserManagementTab };
export const eventTab = { title: "Events", component: EventManagementTab };
export const tabs: ReadonlyArray<TabInfo> = [userTab, eventTab];

export default function AdminPageTabSelector({
    activeTab,
    setActiveTab
} : {
    activeTab: TabInfo;
    setActiveTab: (newActiveTab: TabInfo) => void
}) {
    return <div className="flex flex-col bg-umass-red w-96">
        {tabs.map(tab => {
            return <AdminPageTabButton
                key={tab.title}
                onClick={() => setActiveTab(tab)}
                highlighted={tab == activeTab}
            >{tab.title}</AdminPageTabButton>
        })}
    </div>
}