import AdminPageTabButton from "./AdminPageTabButton";

export type TabInfo = Readonly<{
  title: string;
  href: string;
}>;

export const userTab: TabInfo = {
  title: "Users",
  href: "/admin-page/users",
};
export const eventTab: TabInfo = {
  title: "Events",
  href: "/admin-page/events",
};
export const banTab: TabInfo = {
  title: "Bans",
  href: "/admin-page/bans",
};
export const tabs: ReadonlyArray<TabInfo> = [userTab, eventTab, banTab];

export default function AdminPageTabSelector() {
  return (
    <div className="bg-umass-red flex w-96 shrink-0 flex-col">
      {tabs.map((tab) => {
        return (
          <AdminPageTabButton key={tab.title} href={tab.href}>
            {tab.title}
          </AdminPageTabButton>
        );
      })}
    </div>
  );
}
