import { ReactNode } from "react"

export default function AdminPageTableHeaderCell({
    children
}: {
    children: ReactNode
}) {
    return <th className="p-2 bg-umass-red text-white text-center">{children}</th>
}
