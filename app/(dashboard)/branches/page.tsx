"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { useGetAllBranchesQuery } from "@/redux/api/branchApi";
import { IBranch } from "@/types/staff";
import UpdateBranchModal from "@/components/branches/UpdateBranchModal";
import DeleteBranchModal from "@/components/branches/DeleteBranchModal";

export default function BranchesPage() {
    const { data: branchData, isLoading } = useGetAllBranchesQuery();

    // Modal states
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Branch Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage hospital locations and service centers.</p>
                </div>
                <Link
                    href="/branches/add"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Branch</span>
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Branch Name</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Location</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {!isLoading && branchData?.data.map((branch) => (
                                <tr key={branch._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-900">{branch.branch_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {branch.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedBranch(branch);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="p-2.5 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                                                title="Edit Branch"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedBranch(branch);
                                                    setIsDeleteModalOpen(true)
                                                }}
                                                className="p-2.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all"
                                                title="Delete Branch"
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

            {/* Modals Rendering */}
            {selectedBranch && isUpdateModalOpen && (
                <UpdateBranchModal
                    branch={selectedBranch}
                    onClose={() => {
                        setSelectedBranch(null);
                        setIsUpdateModalOpen(false);
                    }}
                />
            )}

            {selectedBranch && isDeleteModalOpen && (
                <DeleteBranchModal
                    branch={selectedBranch}
                    onClose={() => {
                        setSelectedBranch(null);
                        setIsDeleteModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
