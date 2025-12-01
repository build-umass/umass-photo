import { ReactNode } from "react"

export default function UmassPhotoButton({
  children,
  className,
  ...props
}: {
  children: ReactNode,
  className?: string,
  [key: string]: unknown
}) {
  return <button className={`${className ?? ""} px-5 py-2 font-bold text-3xl text-white rounded-2xl`} {...props}>{children}</button>
}
