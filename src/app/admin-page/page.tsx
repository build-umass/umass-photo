"use client"
import { ReactNode, useEffect, useState } from "react"
import { Tables } from "../utils/supabase/database.types"

enum PageState {
    DEFAULT,
    UNAUTHENTICATED,
    AUTHORIZED,
    UNAUTHORIZED
}

enum RowFlag {
    MODIFIED,
    DELETED,
    NONE
}

function AdminPageTableCell({
    children
}: {
    children: ReactNode
}) {
    return <td className="p-2 border-2">{children}</td>
}

function AdminPageTableHeaderCell({
    children
}: {
    children: ReactNode
}) {
    return <th className="p-2 border-2">{children}</th>
}

function UserManagementRow({
    rowFlag,
    setRowFlag,
    user,
    setUser,
}: {
    rowFlag: RowFlag;
    setRowFlag: (rowFlag: RowFlag) => void;
    user: Tables<"photoclubuser">;
    setUser: (isDeleted: Tables<"photoclubuser">) => void;
}) {
    const role = user.role;
    const setRole = (role: string) => {
        const newUser: Tables<"photoclubuser"> = { ...user };
        newUser.role = role
        setUser(newUser);
        setRowFlag(RowFlag.MODIFIED)
    }

    const colorClass = rowFlag === RowFlag.MODIFIED ? "bg-yellow-50" :
        rowFlag === RowFlag.DELETED ? "bg-red-50" : "";
    return <tr className={`${colorClass}`}>
        <AdminPageTableCell>{user.id}</AdminPageTableCell>
        <AdminPageTableCell>{user.username}</AdminPageTableCell>
        <AdminPageTableCell>{user.email}</AdminPageTableCell>
        <AdminPageTableCell>{user.bio}</AdminPageTableCell>
        <AdminPageTableCell>
            <input className="bg-amber-200" value={role} onChange={(e) => setRole(e.target.value)}></input>
        </AdminPageTableCell>
        <AdminPageTableCell>
            <button className="bg-red-500" onClick={() => setRowFlag(RowFlag.DELETED)}>DELETE</button>
        </AdminPageTableCell>
    </tr>
}

function UserManagementTab() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [rowFlags, setRowFlags] = useState<Record<string, RowFlag>>({});
    const [userData, setUserData] = useState<Record<string, Tables<"photoclubuser">>>({});
    const refreshData = async () => {
        const response = await fetch("/api/get-user-all");
        const data = await response.json();
        const recordEntries = data.map((user: Tables<"photoclubuser">) => [user.id, user])
        setUserData(Object.fromEntries(recordEntries));
        setRowFlags({});
        setIsLoaded(true)
    }
    useEffect(() => {
        refreshData()
    }, [])
    const setRowFlag = (id: string, rowFlag: RowFlag) => {
        setRowFlags((rowFlags) => {
            const newRowFlags = { ...rowFlags };
            if (rowFlag === RowFlag.NONE) delete newRowFlags[id];
            else newRowFlags[id] = rowFlag;
            return newRowFlags;
        });
    }
    const getRowFlag = (id: string) => {
        return rowFlags[id] ?? RowFlag.NONE;
    }
    const setUser = (id: string, user: Tables<"photoclubuser">) => {
        const newUserData: Record<string, Tables<"photoclubuser">> = { ...userData }
        newUserData[id] = user;
        setUserData(newUserData);
    }

    const saveChanges = async () => {
        const toDelete: string[] = []
        const toModify: Tables<"photoclubuser">[] = []
        Object.entries(userData).forEach(([id, row]) => {
            if (rowFlags[id] === RowFlag.DELETED)
                toDelete.push(id);
            if (rowFlags[id] === RowFlag.MODIFIED)
                toModify.push(row);
        });
        setIsLoaded(false);
        await fetch("/api/update-user-data", {
            method: "POST",
            body: JSON.stringify({ toDelete, toModify })
        });
        await refreshData();
    }
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <>
            <table className="border-2">
                <tbody>
                    <tr>
                        <AdminPageTableHeaderCell>ID</AdminPageTableHeaderCell>
                        <AdminPageTableHeaderCell>Username</AdminPageTableHeaderCell>
                        <AdminPageTableHeaderCell>Email</AdminPageTableHeaderCell>
                        <AdminPageTableHeaderCell>Bio</AdminPageTableHeaderCell>
                        <AdminPageTableHeaderCell>Role</AdminPageTableHeaderCell>
                        <AdminPageTableHeaderCell>Delete</AdminPageTableHeaderCell>
                    </tr>
                    {Object.entries(userData).map(([id, row]) => {
                        return <UserManagementRow
                            key={id}
                            rowFlag={getRowFlag(id)}
                            setRowFlag={(rowFlag: RowFlag) => (setRowFlag(id, rowFlag))}
                            user={row}
                            setUser={(user) => setUser(id, user)}
                        ></UserManagementRow>;
                    })}
                </tbody>
            </table>
            <button onClick={saveChanges}>SAVE</button>
        </>
    }
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
            <button onClick={() => setTab(Tab.USER)}>Users</button>
            <button onClick={() => setTab(Tab.EVENT)}>Events</button>
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
            return <div>Figuring out who you are...</div>
        case PageState.UNAUTHENTICATED:
            return <div>I don&apost know who you are</div>
        case PageState.AUTHORIZED:
            return <AdminPageContent></AdminPageContent>
        case PageState.UNAUTHORIZED:
            return <div>You can&apost see this</div>
    }
}