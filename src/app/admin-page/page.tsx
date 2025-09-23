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

function UserManagementRow(props: {
    deleteUser: () => void;
    userReference: User;
}) {
    const [isModified, setIsModified] = useState(false);
    const [role, setRole] = useState(props.userReference.role);
    const setRoleRich = (e: ChangeEvent<HTMLInputElement>) => {
        setRole(e.target.value);
        setIsModified(true)
    }
    return <div>Hi, I am a row!!!!
        <div className="flex gap-2">
            {isModified ? <div>*</div> : <></>}
            <div>{props.userReference.id}</div>
            <div>{props.userReference.username}</div>
            <div>{props.userReference.email}</div>
            <div>{props.userReference.bio}</div>
            <input className="bg-amber-200" value={role} onChange={setRoleRich}></input>
            <button className="bg-red-500" onClick={props.deleteUser}>DELETE</button>
        </div>
        <div><pre>{JSON.stringify(props.userReference)}</pre></div>
    </div>
}

function UserManagementTab() {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        (async () => {
            const response = await fetch("/api/get-user-all");
            const data = await response.json();
            const recordEntries = data.map((user: User) => [user.id, user])
            configurationData.current = Object.fromEntries(recordEntries);
            console.log(JSON.stringify(configurationData.current));
            setIsLoaded(true)
        })()
    }, [])
    const configurationData = useRef<Record<string, User>>({});
    const deleteRow = (id: string) => {
        delete configurationData.current[id];
    }
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <>
        {Object.entries(configurationData.current).map(([id, row]) => {
            return <UserManagementRow key={id} userReference={row} deleteUser={() => deleteRow(id)}></UserManagementRow>;
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