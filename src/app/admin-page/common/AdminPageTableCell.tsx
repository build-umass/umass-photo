import { ReactNode } from "react"

export default function AdminPageTableCell({
    children,
    ...props
}: {
    children?: ReactNode,
    [key: string]: unknown
}) {
    return <td className={`${props.className} p-2 text-umass-red text-center`}>{children}</td>
}