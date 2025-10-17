import { ReactNode } from "react"

export default function AdminPageButton({
  children,
  highlighted,
  className,
  ...props
}: {
  children: ReactNode,
  highlighted?: boolean,
  className?: string,
  [key: string]: unknown
}) {
  const color = highlighted ? "bg-white/20": ""
  return <button className={`${className ?? ""} p-5 ${color} font-bold text-3xl`} {...props}>{children}</button>
}
