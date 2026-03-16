"use client";

import React, { useState, useEffect } from "react";
import { useUpdateBranchMutation } from "@/redux/api/branchApi";
import { toast } from "sonner";
import { X, Loader2, Building2, Save } from "lucide-react";
import { IBranch } from "@/types/staff";

interface UpdateBranchModalProps {
    branch: IBranch;
    onClose: () => void;
}

export default function UpdateBranchModal({ branch, onClose }: UpdateBranchModalProps) {
    const [updateBranch, { isLoading }] = useUpdateBranchMutation();
    const [formData, setFormData] = useState({
        branch_name: branch.branch_name,
        location: branch.location,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateBranch({ id: branch._id, data: formData }).unwrap();
            toast.success("Branch updated successfully");
            onClose();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update branch");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between p-8 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Update Branch</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Branch Name</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            value={formData.branch_name}
                            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Location / Address</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 text-slate-600 rounded-xl py-3.5 font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white rounded-xl py-3.5 font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
