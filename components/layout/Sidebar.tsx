"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import {
    LayoutDashboard,
    Users,
    Package,
    Stethoscope,
    Calendar,
    Settings,
    LogOut,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/nav";
import { useLogoutMutation } from "@/redux/api/authApi"; // Import logout mutation
import { useAppDispatch } from "@/store/hooks"; // Import dispatch
import { logout } from "@/store/slices/authSlice"; // Import logout action
import { toast } from "sonner";

const menuItems: MenuItem[] = [
    { name: "Overview", icon: LayoutDashboard, href: "/" },
    { name: "Staff Management", icon: Users, href: "/staff" },
    { name: "Packages", icon: Package, href: "/packages" },
    { name: "Services", icon: Stethoscope, href: "/services" },
    { name: "Appointments", icon: Calendar, href: "/appointments" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [logoutMutation, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logout()); // Clear Redux state
            toast.success("Logged out successfully");
            router.push("/login"); // Redirect to login
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Stethoscope className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">ProHealth</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-500 font-medium"
                                    : "hover:bg-slate-800 hover:text-slate-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-100"
                                )} />
                                <span>{item.name}</span>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 text-slate-400 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    <span>{isLoading ? "Logging out..." : "Logout"}</span>
                </button>
            </div>
        </div>
    );
}
