"use client"

import { UserResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react"
import NavBarLink from "./NavBarLink";
import { Tables } from "@/app/utils/supabase/database.types";

export default function UserChip() {
    const [currentUser, setCurrentUser] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        (async () => {
            const response = await fetch("/api/user-data")
            const userData: UserResponse["data"] = await response.json();
            if (userData.user) {
                setCurrentUser(userData.user.id);
            }
        })();
    }, [])

    useEffect(() => {
        if (currentUser !== "")
            (async () => {
                const response = await fetch("/api/get-role")
                const role: Tables<"photoclubrole"> = await response.json();
                setIsAdmin(role.is_admin);
            })();
    }, [currentUser])

    if (currentUser === "") {
        return <NavBarLink href="/login">Login</NavBarLink>
    } else {
        if (isAdmin) {
            return <NavBarLink href="/admin-page">Admin</NavBarLink>
        }
    }
}
