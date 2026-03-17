"use client";

import React from "react";
import { useDeletePackageMutation } from "@/redux/api/packageApi";
import { toast } from "sonner";
import { X, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { IPackage } from "@/types/package";

interface DeletePackageModalProps {
    pkg: IPackage | null;
    onClose: () => void;
}

export default function DeletePackageModal({ pkg, onClose }: DeletePackageModalProps) {
    const [deletePackage, { isLoading }] = useDeletePackageMutation();

    if (!pkg) return null;

    const handleDelete = async () => {
        try {
            await deletePackage(pkg._id!).unwrap();
            toast.success("Package deleted successfully");
            onClose();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to delete package");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto border border-red-100">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Confirm Deletion</h3>
                        <p className="text-slate-500 text-sm font-medium">
                            Are you sure you want to delete <span className="text-slate-900 font-bold">"{pkg.package_name}"</span>? This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white rounded-xl py-3.5 font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    <span>Yes, Delete Package</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full bg-slate-50 text-slate-600 rounded-xl py-3.5 font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                        >
                            No, Keep it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
