import { ReactNode } from "react"

export default function AdminPageTableHeaderCell({
    children
}: {
    children: ReactNode
}) {
    return <th className="p-2 border-2">{children}</th>
}
