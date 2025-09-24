"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react"

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

function UserManagementRow({
    isDeleted,
    setIsDeleted,
    isModified,
    setIsModified,
    user,
    setUser,
}: {
    isDeleted: boolean;
    setIsDeleted: (isDeleted: boolean) => void;
    isModified: boolean;
    setIsModified: (isDeleted: boolean) => void;
    user: User;
    setUser: (isDeleted: User) => void;
}) {
    const role = user.role;
    const setRole = (role: string) => {
        const newUser: User = {...user};
        newUser.role = role
        setUser(user);
    }
    const setRoleRich = (e: ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
        setIsModified(true)
    }
    return <div>Hi, I am a row!!!!
        <div className="flex gap-2">
            {isModified ? <div>*</div> : <></>}
            {isDeleted ? <div>X</div> : <></>}
            <div>{user.id}</div>
            <div>{user.username}</div>
            <div>{user.email}</div>
            <div>{user.bio}</div>
            <input className="bg-amber-200" value={role} onChange={setRoleRich}></input>
            <button className="bg-red-500" onClick={() => setIsDeleted(true)}>DELETE</button>
        </div>
        <div><pre>{JSON.stringify(user)}</pre></div>
    </div>
}

function UserManagementTab() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [modifiedUserIds, setModifiedUserIds] = useState(new Set<string>());
    const [deletedUserIds, setDeletedUserIds] = useState(new Set<string>());
    const configurationData = useRef<Record<string, User>>({});
    useEffect(() => {
        (async () => {
            const response = await fetch("/api/get-user-all");
            const data = await response.json();
            const recordEntries = data.map((user: User) => [user.id, user])
            configurationData.current = Object.fromEntries(recordEntries);
            setIsLoaded(true)
        })()
    }, [])
    const setIsDeleted = (id: string, isDeleted: boolean) => {
        setDeletedUserIds((deletedUserIds) => {
            const newDeletedUserIds = new Set(deletedUserIds);
            if(isDeleted) newDeletedUserIds.add(id);
            else newDeletedUserIds.delete(id);
            return newDeletedUserIds;
        });
    }
    const setIsModified = (id: string, isModified: boolean) => {
        setModifiedUserIds((modifiedUserIds) => {
            const newModifiedUserIds = new Set(modifiedUserIds);
            if(isModified) newModifiedUserIds.add(id);
            else newModifiedUserIds.delete(id);
            return newModifiedUserIds;
        });
    }
    const setUser = (id: string, user: User) => {
        configurationData.current[id] = user;
    }
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <>
        {Object.entries(configurationData.current).map(([id, row]) => {
            return <UserManagementRow
            key={id}
            isDeleted={deletedUserIds.has(id)}
            setIsDeleted={(isDeleted) => setIsDeleted(id, isDeleted)}
            isModified={modifiedUserIds.has(id)}
            setIsModified={(isModified) => setIsModified(id, isModified)}
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