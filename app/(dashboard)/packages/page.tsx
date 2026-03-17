"use client";

import {
    Plus,
    Edit2,
    Trash2,
    ShieldCheck,
    Calendar,
    Hash,
    DollarSign
} from "lucide-react";
import Link from "next/link";
import { useGetAllPackagesQuery } from "@/redux/api/packageApi";
import { useState } from "react";
import UpdatePackageModal from "@/components/packages/UpdatePackageModal";

export default function PackagesPage() {

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

    const { data: packageData, isLoading } = useGetAllPackagesQuery("");

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
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6">
                                            <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : packageData?.data.map((pkg) => (
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
                                                onClick={() => {
                                                    setSelectedPackageId(pkg._id || null);
                                                    setIsUpdateModalOpen(true);
                                                }}
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
                            {!isLoading && (!packageData?.data || packageData.data.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-400 font-bold">No packages found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <UpdatePackageModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedPackageId(null);
                }}
                packageId={selectedPackageId}
            />
        </div>
    );
}
