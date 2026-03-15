"use client";

import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
    Users,
    Calendar,
    Package,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function DashboardOverview() {
    const user = useAppSelector((state) => state.auth.user);

    const stats = [
        { name: "Total Staff", value: "24", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Appointments", value: "142", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        { name: "Active Packages", value: "12", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
        { name: "Revenue", value: "$12,450", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    const recentActivity = [
        { id: 1, type: "appointment", message: "New appointment scheduled by John Doe", time: "2 mins ago", status: "success" },
        { id: 2, type: "staff", message: "Dr. Sarah Smith updated her profile", time: "15 mins ago", status: "info" },
        { id: 3, type: "package", message: "Premium Care package purchased", time: "1 hour ago", status: "success" },
        { id: 4, type: "system", message: "Database backup completed successfully", time: "3 hours ago", status: "warning" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || "Admin"}</h1>
                <p className="text-slate-500">Here's what's happening at your medical center today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === "success" ? "bg-emerald-50 text-emerald-600" :
                                            activity.status === "info" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                        }`}>
                                        {activity.status === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                                            activity.status === "info" ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    {activity.id !== recentActivity.length && (
                                        <div className="absolute top-10 left-1/2 w-0.5 h-6 bg-slate-100 -translate-x-1/2" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                                <Users className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Add New Staff</p>
                                <p className="text-xs text-slate-500">Register a new doctor or nurse</p>
                            </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-purple-400 transition-colors">
                                <Calendar className="w-5 h-5 text-slate-600 group-hover:text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">New Appointment</p>
                                <p className="text-xs text-slate-500">Schedule a patient visit</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
