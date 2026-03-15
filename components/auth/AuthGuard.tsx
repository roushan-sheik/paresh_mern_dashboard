"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data, isLoading, isError } = useGetMeQuery();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (data?.success) {
            dispatch(setUser(data.data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (!isLoading && isError && pathname !== "/login") {
            router.push("/login");
        }
        if (!isLoading && data?.success && pathname === "/login") {
            router.push("/");
        }
    }, [isLoading, isError, data, router, pathname]);

    // Show spinner ONLY on initial load when we don't have a user yet
    if (isLoading && !user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading session...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
