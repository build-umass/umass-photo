import { ReactNode } from "react"

export default function AdminPageTableCell({
    children
}: {
    children: ReactNode
}) {
    return <td className="p-2 text-umass-red text-center">{children}</td>
}