"use client";

import {
    Clock,
    DollarSign,
    Edit2,
    Trash2,
    Stethoscope
} from "lucide-react";
import { useGetAllServicesQuery } from "@/redux/api/serviceApi";
import { IService } from "@/types/service";
import { useState } from "react";
import DeleteServiceModal from "@/components/services/DeleteServiceModal";

export default function ServiceListPage() {
    const { data: serviceData, isLoading } = useGetAllServicesQuery();

    const [selectedService, setSelectedService] = useState<IService | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Service Directory</h1>
                    <p className="text-slate-500 mt-1 font-medium">View and manage healthcare services, pricing, and durations.</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                            <tr>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest">Service Name</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-center">Duration</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-center">Cost</th>
                                <th className="px-8 py-5 font-bold text-[11px] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6">
                                            <div className="h-6 bg-slate-100 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : serviceData?.data.map((service) => (
                                <tr key={service._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                                <Stethoscope className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-900">{service.service_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium bg-slate-50 py-1.5 rounded-lg border border-slate-100 w-24 mx-auto">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span>{service.duration}m</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-24 mx-auto">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{service.cost}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2.5 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                                                title="Edit Service"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all"
                                                title="Delete Service"
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
            {selectedService && isDeleteModalOpen && (
                <DeleteServiceModal
                    service={selectedService}
                    onClose={() => {
                        setSelectedService(null);
                        setIsDeleteModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
