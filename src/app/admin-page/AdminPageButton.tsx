import { ReactNode } from "react"

export default function AdminPageButton({
  children,
  ...props
}: {
  children: ReactNode,
  [key: string]: unknown
}) {
  return <button className="p-1 border-2" {...props}>{children}</button>
}
