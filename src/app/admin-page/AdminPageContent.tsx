import { useState } from "react";
import AdminPageTabSelector, { TabInfo, userTab } from "./AdminPageTabSelector";

export default function AdminPageContent() {
    const [activeTab, setActiveTab] = useState<TabInfo>(userTab)
    const TabContent = activeTab.component;

    return <div className="flex flex-grow">
        <AdminPageTabSelector activeTab={activeTab} setActiveTab={setActiveTab}></AdminPageTabSelector>
        <TabContent></TabContent>
    </div>
}
