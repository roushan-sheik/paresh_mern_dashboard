"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Save,
    X,
    Clock,
    DollarSign,
    Layout,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetServiceByIdQuery, useUpdateServiceMutation } from "@/redux/api/serviceApi";
import { toast } from "sonner";
import { IOverviewSection, ISubSection } from "@/types/service";

interface UpdateServiceModalProps {
    serviceId: string;
    onClose: () => void;
}

export default function UpdateServiceModal({ serviceId, onClose }: UpdateServiceModalProps) {
    const { data: detailData, isLoading: isFetching } = useGetServiceByIdQuery(serviceId);
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        service_name: "",
        duration: "",
        cost: "",
        description: "",
        image: null as File | null,
        overview: [] as IOverviewSection[]
    });

    // Pre-fill form when data is fetched
    useEffect(() => {
        if (detailData?.data) {
            const service = detailData.data;
            setForm({
                service_name: service.service_name || "",
                duration: service.duration?.toString() || "",
                cost: service.cost?.toString() || "",
                description: service.description || "",
                image: null,
                overview: service.overview || []
            });
            setImagePreview(service.image || null);
        }
    }, [detailData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Overview Handlers
    const addOverview = () => {
        setForm(prev => ({
            ...prev,
            overview: [...prev.overview, { heading: "", description: "", sub_sections: [] }]
        }));
    };

    const removeOverview = (index: number) => {
        setForm(prev => ({
            ...prev,
            overview: prev.overview.filter((_, i) => i !== index)
        }));
    };

    const updateOverview = (index: number, field: keyof IOverviewSection, value: string) => {
        setForm(prev => ({
            ...prev,
            overview: prev.overview.map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };

    // Sub Section Handlers
    const addSubSection = (overviewIndex: number) => {
        setForm(prev => ({
            ...prev,
            overview: prev.overview.map((item, i) =>
                i === overviewIndex
                    ? { ...item, sub_sections: [...item.sub_sections, { heading: "", description: "" }] }
                    : item
            )
        }));
    };

    const updateSubSection = (overviewIndex: number, subIndex: number, field: keyof ISubSection, value: string) => {
        setForm(prev => ({
            ...prev,
            overview: prev.overview.map((item, i) =>
                i === overviewIndex
                    ? {
                        ...item,
                        sub_sections: item.sub_sections.map((sub, si) =>
                            si === subIndex ? { ...sub, [field]: value } : sub
                        )
                    }
                    : item
            )
        }));
    };

    const removeSubSection = (overviewIndex: number, subIndex: number) => {
        setForm(prev => ({
            ...prev,
            overview: prev.overview.map((item, i) =>
                i === overviewIndex
                    ? { ...item, sub_sections: item.sub_sections.filter((_, si) => si !== subIndex) }
                    : item
            )
        }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("service_name", form.service_name);
            formData.append("duration", form.duration);
            formData.append("cost", form.cost);
            formData.append("description", form.description);
            if (form.image) formData.append("image", form.image);
            formData.append("overview", JSON.stringify(form.overview));

            await updateService({ id: serviceId, data: formData }).unwrap();
            toast.success("Service updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update service");
        }
    };

    if (isFetching) {
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-[2rem] flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold">Loading Service Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Update Service</h2>
                        <p className="text-slate-500 text-sm font-medium">Modify service details and process overview.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-4">
                                <label className="text-sm font-bold text-slate-700 block ml-1">Service Image <span className="text-red-500">*</span></label>
                                <div onClick={() => fileInputRef.current?.click()} className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden group hover:border-blue-400">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold">Change Image</p>
                                            </div>
                                        </>
                                    ) : <ImageIcon className="w-8 h-8 text-slate-300" />}
                                </div>
                                <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                            </div>

                            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" /> Duration (mins) <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-emerald-500" /> Cost ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Service Name <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-lg font-bold outline-none" value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Short Description <span className="text-red-500">*</span></label>
                                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                </div>

                                {/* Dynamic Overview Sections */}
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <Layout className="w-4 h-4 text-blue-500" /> Process Overview
                                        </h2>
                                        <button onClick={addOverview} className="text-blue-600 hover:text-blue-700 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg uppercase">
                                            <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Section
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {form.overview.map((section, idx) => (
                                            <div key={idx} className="relative bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100 space-y-4">
                                                <button onClick={() => removeOverview(idx)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <input placeholder="Section Heading" className="bg-transparent text-slate-900 font-bold border-b border-slate-200 w-full py-1 outline-none" value={section.heading} onChange={(e) => updateOverview(idx, 'heading', e.target.value)} />
                                                <textarea placeholder="Description" className="bg-transparent text-slate-600 font-medium text-sm w-full outline-none resize-none" value={section.description} onChange={(e) => updateOverview(idx, 'description', e.target.value)} />

                                                <div className="pl-6 border-l-2 border-blue-100 space-y-4">
                                                    {section.sub_sections.map((sub, sIdx) => (
                                                        <div key={sIdx} className="flex gap-4 items-start">
                                                            <div className="flex-1 grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                                <input className="text-xs font-bold text-slate-800 outline-none" placeholder="Sub Heading" value={sub.heading} onChange={(e) => updateSubSection(idx, sIdx, 'heading', e.target.value)} />
                                                                <input className="text-xs font-medium text-slate-500 outline-none" placeholder="Sub Description" value={sub.description} onChange={(e) => updateSubSection(idx, sIdx, 'description', e.target.value)} />
                                                            </div>
                                                            <button onClick={() => removeSubSection(idx, sIdx)} className="p-2 text-slate-300 hover:text-red-500 mt-3">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => addSubSection(idx)} className="text-[10px] font-bold text-blue-500 uppercase hover:text-blue-700 transition-all font-mono">
                                                        + Add Subsection
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="bg-blue-600 text-white rounded-2xl px-12 py-4 font-extrabold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-70"
                    >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span>{isUpdating ? "Updating..." : "Save Changes"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
