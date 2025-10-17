import { ReactNode } from "react"

export default function AdminPageButton({
  children,
  highlighted,
  ...props
}: {
  children: ReactNode,
  highlighted?: boolean,
  [key: string]: unknown
}) {
  const color = highlighted ? "bg-white/20": ""
  return <button className={`${props.className} p-5 ${color} font-bold text-3xl`} {...props}>{children}</button>
}
