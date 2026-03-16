"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Loader2, Save } from "lucide-react";
import { useAddBranchMutation } from "@/redux/api/branchApi";
import { toast } from "sonner";

export default function AddBranchPage() {
    const router = useRouter();
    const [addBranch, { isLoading }] = useAddBranchMutation();
    const [formData, setFormData] = useState({
        branch_name: "",
        location: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addBranch(formData).unwrap();
            toast.success("New branch created successfully");
            router.push("/branches");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to create branch");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
            <div className="w-full max-w-2xl space-y-6">
                <Link href="/branches" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 text-sm font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Branch List
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Add New Branch</h1>
                            <p className="text-slate-500 text-sm font-medium">Register a new clinic or hospital location.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Branch Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                placeholder="e.g. South Central Hospital"
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
                                placeholder="e.g. 123 Health Street, Downtown"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Create Branch Center</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
