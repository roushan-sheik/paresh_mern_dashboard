"use client";

import { useState } from "react";
import { useGetAllStaffQuery } from "@/redux/api/staffApi";
import { Loader2, MapPin, Mail, User as UserIcon, Plus } from "lucide-react";
import ChangeBranchModal from "@/components/staff/ChangeBranchModal";
import Link from "next/link";

export default function StaffListPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useGetAllStaffQuery({ page, limit: 10 });
    const [selectedStaff, setSelectedStaff] = useState<any>(null);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    const staffs = data?.data?.staffs || [];
    const pagination = data?.data?.pagination;


    return (
        <div className="space-y-8">
            {/* Updated Header Section to match Branches */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Members</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage all clinical and administrative staff.</p>
                </div>
                <Link
                    href="/staff/add"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Staff</span>
                </Link>
            </div>
            {/* Updated Table Wrapper and styling */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Staff</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Branch</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {staffs.map((staff: any) => (
                                <tr key={staff._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{staff.user?.name || "Unknown"}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                    <Mail className="w-3 h-3" /> {staff.user?.email || "No Email"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {staff.branch?.branch_name || "Unassigned"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedStaff(staff)}
                                            className="text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors cursor-pointer bg-blue-50 px-4 py-2 rounded-lg"
                                        >
                                            Change Branch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1 || isFetching}
                        className="h-9 px-3 rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-500 mx-2">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.totalPages || isFetching}
                        className="h-9 px-3 rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Next
                    </button>
                </div>
            )}

            {selectedStaff && (
                <ChangeBranchModal
                    staff={selectedStaff}
                    onClose={() => setSelectedStaff(null)}
                />
            )}
        </div>
    );
}
