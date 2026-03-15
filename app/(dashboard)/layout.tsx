"use client";

import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar stays mounted here only for dashboard routes */}
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
