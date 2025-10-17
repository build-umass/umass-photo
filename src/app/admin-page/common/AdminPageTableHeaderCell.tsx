import { ReactNode } from "react"

export default function AdminPageTableHeaderCell({
    children,
    ...props
}: {
    children?: ReactNode,
    [key: string]: unknown
}) {
    return <th className={`${props.className} p-2 bg-umass-red text-white text-center text-5xl`}>{children}</th>
}
