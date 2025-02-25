'use client'

import { SideBarNavItem } from "@/types"
import Link from "next/link";
import { Icon as Icons } from "./icon";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
    items: SideBarNavItem[];
}


export default function DashboardNav({items}: DashboardNavProps) {

    const path = usePathname();


    if (!items.length) {
        return null;
    }
    return (
        <nav>
            {items.map((item, index) => {
                const Icon = Icons[item.icon || "arrowRight"];
                return (
                <Link href={item.href!} key={index}>
                    <span className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-accent-foreground ${path === item.href ? "bg-accent" : "transparent"}`}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </span>
                </Link>
            )
        })}
        </nav>
    )
}