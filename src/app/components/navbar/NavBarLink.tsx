import Link from "next/link"
import { ReactNode } from "react"

export default function NavBarLink({ children, href }: { children: ReactNode, href: string }) {
    return <Link
        href={href}
        className="flex items-center justify-center text-lg font-bold hover:bg-white/20 transition-colors duration-200 h-full px-6"
    >{children}</Link>
}