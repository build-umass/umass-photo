import { ReactNode } from "react"

export default function AdminPageButton({
  children,
  highlighted,
  ...props
}: {
  children: ReactNode,
  highlighted: boolean,
  [key: string]: unknown
}) {
  const color = highlighted ? "bg-white/10": ""
  return <button className={`p-1 border-2 w-96 ${color}`} {...props}>{children}</button>
}
