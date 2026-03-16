"use client";

import React from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ShieldCheck,
    Calendar,
    Hash,
    DollarSign,
    Box
} from "lucide-react";
import Link from "next/link";
import { IPackage } from "@/types/package";

const mockPackages: IPackage[] = [
    { _id: "699fcf0881f3d6b77592aa9e", package_name: "Basic Health Plan", validity_duration: 30, cost: 499, total_sessions: 8 },
    { _id: "699fcf0881f3d6b77592aa9f", package_name: "Standard Health Plan", validity_duration: 90, cost: 1299, total_sessions: 8 },
    { _id: "699fcf0881f3d6b77592aaa0", package_name: "Premium Health Plan", validity_duration: 180, cost: 2299, total_sessions: 9 },
    { _id: "699fcf0881f3d6b77592aaa1", package_name: "Family Basic Plan", validity_duration: 30, cost: 899, total_sessions: 5 },
    { _id: "699fcf0881f3d6b77592aaa2", package_name: "Family Premium Plan", validity_duration: 180, cost: 3499, total_sessions: 12 },
    { _id: "699fcf0881f3d6b77592aaa3", package_name: "Senior Citizen Plan", validity_duration: 365, cost: 1999, total_sessions: 9 },
];

export default function PackagesPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Healthcare Packages</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and monitor health subscription plans and sessions.</p>
                </div>
                <Link
                    href="/packages/add"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] w-full md:w-auto text-sm"
                >
                    <Plus className="w-5 h-5" />
                    Create New Package
                </Link>
            </div>

            {/* Packages Table Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Package Name</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-center">Validity</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-center">Sessions</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-center">Cost</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockPackages.map((pkg) => (
                                <tr key={pkg._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-900">{pkg.package_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium bg-slate-50 py-1.5 rounded-lg border border-slate-100 w-32 mx-auto">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            <span>{pkg.validity_duration} Days</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium bg-slate-50 py-1.5 rounded-lg border border-slate-100 w-32 mx-auto">
                                            <Hash className="w-4 h-4 text-slate-400" />
                                            <span>{pkg.total_sessions} Sessions</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-24 mx-auto">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{pkg.cost}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2.5 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                                                title="Edit Package"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all"
                                                title="Delete Package"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
