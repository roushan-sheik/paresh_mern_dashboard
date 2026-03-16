"use client";

import React from "react";
import { useDeleteServiceMutation } from "@/redux/api/serviceApi";
import { toast } from "sonner";
import { X, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { IService } from "@/types/service";

interface DeleteServiceModalProps {
    service: IService;
    onClose: () => void;
}

export default function DeleteServiceModal({ service, onClose }: DeleteServiceModalProps) {
    const [deleteService, { isLoading }] = useDeleteServiceMutation();

    const handleDelete = async () => {
        try {
            await deleteService(service._id!).unwrap();
            toast.success("Service deleted successfully");
            onClose();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to delete service");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto border border-red-100">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Confirm Deletion</h3>
                        <p className="text-slate-500 text-sm font-medium">
                            Are you sure you want to delete <span className="text-slate-900 font-bold">"{service.service_name}"</span>? This will remove it from the directory permanently.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white rounded-xl py-3.5 font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            <span>{isLoading ? "Deleting..." : "Yes, Delete Service"}</span>
                        </button>
                        <button
                            onClick={onClose}
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
