import { ReactNode } from "react"

export default function AdminPageTableCell({
    children
}: {
    children: ReactNode
}) {
    return <td className="p-2 border-2">{children}</td>
}