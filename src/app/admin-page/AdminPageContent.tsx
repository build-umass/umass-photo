import UserManagementTab from "./UserManagementTab"
import EventManagementTab from "./EventManagementTab"
import { ReactNode, useState } from "react"
import AdminPageTabButton from "./AdminPageTabButton"

type TabInfo = Readonly<{
    title: string;
    component: () => ReactNode;
}>;

const userTab =  { title: "Users",  component: UserManagementTab  };
const eventTab = { title: "Events", component: EventManagementTab };
const tabs: ReadonlyArray<TabInfo> = [userTab, eventTab];

export default function AdminPageContent() {
    const [activeTab, setActiveTab] = useState<TabInfo>(userTab)
    const currentTab = activeTab.component();

    return <div className="flex">
        <div className="flex flex-col bg-umass-red w-96">
            {tabs.map(tab => {
                return <AdminPageTabButton
                    key={tab.title}
                    onClick={() => setActiveTab(tab)}
                    highlighted={tab == activeTab}
                >{tab.title}</AdminPageTabButton>
            })}
        </div>
        <div>
            {currentTab}
        </div>
    </div>
}
