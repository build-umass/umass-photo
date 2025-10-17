import { ReactNode } from "react"

export default function AdminPageTableHeaderCell({
    children,
    className,
    ...props
}: {
    children?: ReactNode,
    className?: string,
    [key: string]: unknown
}) {
    return <th className={`${className ?? ""} p-2 bg-umass-red text-white text-center text-5xl`} {...props}>{children}</th>
}
