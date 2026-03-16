"use client";

import React, { useState, useRef } from "react";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Save,
    ArrowLeft,
    Clock,
    DollarSign,
    Layout,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IOverviewSection, ISubSection } from "@/types/service";
import { useRouter } from "next/navigation";
import { useCreateServiceMutation } from "@/redux/api/serviceApi";
import { toast } from "sonner";


export default function AddServicePage() {
    const router = useRouter();
    const [createService, { isLoading }] = useCreateServiceMutation();
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

    const handleSave = async () => {
        // Validation
        if (!form.service_name || !form.duration || !form.cost || !form.description || !form.image) {
            toast.error("Please fill in all basic fields and upload an image.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("service_name", form.service_name);
            formData.append("duration", form.duration);
            formData.append("cost", form.cost);
            formData.append("description", form.description);
            formData.append("image", form.image);

            // Backend expects overview as stringified JSON
            formData.append("overview", JSON.stringify(form.overview));
            await createService(formData).unwrap();
            toast.success("Service created successfully!");
            router.push("/services");
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to create service");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/services" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Services
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Service</h1>
                        <p className="text-slate-500 mt-1 font-medium">Define a new medical service with pricing and detailed overview.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Image */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
                        <label className="text-sm font-bold text-slate-700 block ml-1">Service Image <span className="text-red-500">*</span></label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "relative w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden group",
                                imagePreview ? "border-blue-200 bg-blue-50/20" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                            )}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-bold">Change Image</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-slate-400">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-xs font-bold text-slate-600">Upload Image</p>
                                        <p className="text-[10px] text-slate-400 font-medium">PNG, JPG up to 5MB</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                    </div>

                    {/* Pricing & Duration */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" /> Duration (mins) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 45"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-500" /> Cost ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 100"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                value={form.cost}
                                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Service Details & Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Service Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter service name..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={form.service_name}
                                    onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Short Description <span className="text-red-500">*</span></label>
                                <textarea
                                    placeholder="Brief explanation of the service..."
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Dynamic Overview Sections */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <Layout className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Process Overview Sections</h2>
                                </div>
                                <button
                                    onClick={addOverview}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs transition-colors py-1.5 px-3 bg-blue-50 rounded-lg uppercase tracking-wider"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Section
                                </button>
                            </div>

                            <div className="space-y-6">
                                {form.overview.length === 0 && (
                                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-[1.5rem]">
                                        <p className="text-slate-400 text-sm font-medium">No overview sections added yet.</p>
                                    </div>
                                )}

                                {form.overview.map((section, idx) => (
                                    <div key={idx} className="group relative bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100 space-y-4">
                                        <button
                                            onClick={() => removeOverview(idx)}
                                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-1 gap-3 pr-8">
                                            <input
                                                placeholder="Section Heading (e.g. Process Overview)"
                                                className="bg-transparent text-slate-900 font-bold border-b border-slate-200 py-1 focus:border-blue-500 outline-none transition-all"
                                                value={section.heading}
                                                onChange={(e) => updateOverview(idx, 'heading', e.target.value)}
                                            />
                                            <textarea
                                                placeholder="Section Description..."
                                                className="bg-transparent text-slate-600 font-medium text-sm py-1 outline-none resize-none"
                                                rows={2}
                                                value={section.description}
                                                onChange={(e) => updateOverview(idx, 'description', e.target.value)}
                                            />
                                        </div>

                                        {/* Sub Sections */}
                                        <div className="pl-6 border-l-2 border-blue-100 space-y-4 mt-6">
                                            {section.sub_sections.map((sub, sIdx) => (
                                                <div key={sIdx} className="flex gap-4 items-start group/sub">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Heading</p>
                                                            <input
                                                                className="w-full text-xs font-bold text-slate-800 outline-none border-b border-slate-50 focus:border-blue-400 transition-all py-1 px-1 mt-1"
                                                                value={sub.heading}
                                                                onChange={(e) => updateSubSection(idx, sIdx, 'heading', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</p>
                                                            <input
                                                                className="w-full text-xs font-medium text-slate-500 outline-none border-b border-slate-50 focus:border-blue-400 transition-all py-1 px-1 mt-1"
                                                                value={sub.description}
                                                                onChange={(e) => updateSubSection(idx, sIdx, 'description', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSubSection(idx, sIdx)}
                                                        className="mt-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addSubSection(idx)}
                                                className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition-colors px-2 py-1 hover:bg-white rounded-md w-fit"
                                            >
                                                <Plus className="w-3 h-3" /> Add SubSection
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final Submit Action */}
                        <div className="pt-6">
                            <button
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white rounded-2xl py-5 font-extrabold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98] text-lg disabled:opacity-70"
                                onClick={handleSave}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <Save className="w-6 h-6" />
                                )}
                                <span>{isLoading ? "Creating Service..." : "Create Healthcare Service"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
