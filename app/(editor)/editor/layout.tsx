
import MainNav from "@/components/main-nav";
import SiteFooter from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { dashboardConfig } from "@/config/dashboard";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DashboardNav from "@/components/dashboard-nav"
import { Toaster } from "@/components/ui/toaster";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto grid items-center gap-10 py-8">
        {children}
    </div>
  );
}