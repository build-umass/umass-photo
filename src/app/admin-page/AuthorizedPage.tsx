import { ChangeEvent, useEffect, useRef, useState } from "react"

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
            configurationData.current = data;
            setIsLoaded(true)
        })()
    }, [])
    const configurationData = useRef([]);
    if (!isLoaded) {
        return <>loading...</>
    } else {
        return <>
        {configurationData.current.map((row, index) => {
            return <UserManagementRow key={index} userReference={row} deleteUser={() => {}}></UserManagementRow>;
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

export default function AuthorizedPage() {
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