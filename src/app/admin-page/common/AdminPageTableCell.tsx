import { ReactNode } from "react"

export default function AdminPageTableCell({
    children,
    className,
    ...props
}: {
    children?: ReactNode,
    className?: string,
    [key: string]: unknown
}) {
    return <td className={`${className} p-2 text-umass-red text-center`} {...props}>{children}</td>
}