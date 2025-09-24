"use client"
import { useEffect, useState } from "react"

enum PageState {
    DEFAULT,
    UNAUTHENTICATED,
    AUTHORIZED,
    UNAUTHORIZED
}

type User = {
    id: string,
    username: string,
    email: string,
    bio: string,
    role: string,
}

enum RowFlag {
    MODIFIED,
    DELETED,
    NONE
}

function UserManagementRow({
    rowFlag,
    setRowFlag,
    user,
    setUser,
}: {
    rowFlag: RowFlag;
    setRowFlag: (rowFlag: RowFlag) => void;
    user: User;
    setUser: (isDeleted: User) => void;
}) {
    const role = user.role;
    const setRole = (role: string) => {
        const newUser: User = { ...user };
        newUser.role = role
        setUser(newUser);
        setRowFlag(RowFlag.MODIFIED)
    }
    return <div>Hi, I am a row!!!!
        <div className="flex gap-2">
            {rowFlag === RowFlag.MODIFIED ? <div>*</div> : <></>}
            {rowFlag === RowFlag.DELETED ? <div>X</div> : <></>}
            <div>{user.id}</div>
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.bio}</div>
            <input className="bg-amber-200" value={role} onChange={(e) => setRole(e.target.value)}></input>
            <button className="bg-red-500" onClick={() => setRowFlag(RowFlag.DELETED)}>DELETE</button>
        </div>
        <div><pre>{JSON.stringify(user)}</pre></div>
    </div>
}

function UserManagementTab() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [rowFlags, setRowFlags] = useState(new Map<string, RowFlag>());
    const [userData, setUserData] = useState<Record<string, User>>({});
    const refreshData = async () => {
        const response = await fetch("/api/get-user-all");
        const data = await response.json();
        const recordEntries = data.map((user: User) => [user.id, user])
        setUserData(Object.fromEntries(recordEntries));
        setRowFlags(new Map());
        setIsLoaded(true)
    }
    useEffect(() => {
        refreshData()
    }, [])
    const setRowFlag = (id: string, rowFlag: RowFlag) => {
        setRowFlags((rowFlags) => {
            const newRowFlags = new Map(rowFlags);
            if (rowFlag === RowFlag.NONE) newRowFlags.delete(id);
            else newRowFlags.set(id, rowFlag);
            return newRowFlags;
        });
    }
    const getRowFlag = (id: string) => {
        return rowFlags.get(id) ?? RowFlag.NONE;
    }
    const setUser = (id: string, user: User) => {
        const newUserData: Record<string, User> = { ...userData }
        newUserData[id] = user;
        setUserData(newUserData);
    }
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <>
            {Object.entries(userData).map(([id, row]) => {
                return <UserManagementRow
                    key={id}
                    rowFlag={getRowFlag(id)}
                    setRowFlag={(rowFlag: RowFlag) => (setRowFlag(id, rowFlag))}
                    user={row}
                    setUser={(user) => setUser(id, user)}
                ></UserManagementRow>;
            })}
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