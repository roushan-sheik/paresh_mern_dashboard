"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    X,
    Trash2,
    Image as ImageIcon,
    Save,
    Clock,
    DollarSign,
    Layout,
    PlusCircle,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IOverviewSection, ISubSection } from "@/types/service";
import { IPackageService } from "@/types/package";
import { useGetPackageByIdQuery, useUpdatePackageMutation } from "@/redux/api/packageApi";
import { useGetAllServicesQuery } from "@/redux/api/serviceApi";
import { toast } from "sonner";

interface UpdatePackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageId: string | null;
}

export default function UpdatePackageModal({ isOpen, onClose, packageId }: UpdatePackageModalProps) {
    const { data: servicesData, isLoading: isServicesLoading } = useGetAllServicesQuery();
    const { data: fetchedData, isLoading: isFetching, isError } = useGetPackageByIdQuery(packageId as string, {
        skip: !packageId || !isOpen,
    });
    const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        package_name: "",
        validity_duration: "",
        cost: "",
        description: "",
        image: null as File | null,
        services: [] as IPackageService[],
        overview: [] as IOverviewSection[]
    });

    // Populate form data when fetchedData is available
    useEffect(() => {
        if (fetchedData?.data) {
            const pkg = fetchedData.data;
            setForm({
                package_name: pkg.package_name,
                validity_duration: pkg.validity_duration.toString(),
                cost: pkg.cost.toString(),
                description: pkg.description,
                image: null,
                // Backend might return populated services or just IDs, mapping specifically her:
                services: (pkg.services || []).map((s: any) => ({
                    service_id: s.service_id?._id || s.service_id,
                    required_sessions: s.required_sessions
                })),
                overview: (pkg.overview || []).map((o: any) => ({
                    ...o,
                    sub_sections: o.sub_sections || []
                }))
            });
            setImagePreview(pkg.image as string);
        }
    }, [fetchedData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Services Selection Handlers
    const addService = (serviceId: string) => {
        if (!serviceId) return;
        setForm(prev => {
            const exists = prev.services.find(s => s.service_id === serviceId);
            if (exists) return prev;
            return {
                ...prev,
                services: [...prev.services, { service_id: serviceId, required_sessions: 1 }]
            };
        });
    };

    const removeService = (serviceId: string) => {
        setForm(prev => ({
            ...prev,
            services: prev.services.filter(s => s.service_id !== serviceId)
        }));
    };

    const updateServiceSessions = (serviceId: string, sessions: number) => {
        setForm(prev => ({
            ...prev,
            services: prev.services.map(s => s.service_id === serviceId ? { ...s, required_sessions: sessions } : s)
        }));
    };

    // Overview Handlers (Same as Add Page)
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
        if (!form.package_name || !form.validity_duration || !form.cost || !form.description || form.services.length === 0) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("package_name", form.package_name);
            formData.append("validity_duration", form.validity_duration);
            formData.append("cost", form.cost);
            formData.append("description", form.description);
            if (form.image) formData.append("image", form.image);
            formData.append("services", JSON.stringify(form.services));
            formData.append("overview", JSON.stringify(form.overview));

            await updatePackage({ id: packageId as string, data: formData }).unwrap();
            toast.success("Package updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update package");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                            <ShieldCheck className="w-4 h-4" /> Editing Package
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mt-1">Update Package Details</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white hover:text-red-500 text-slate-400 rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isFetching ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">Fetching package details...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
                                        <label className="text-sm font-bold text-slate-700 block ml-1">Package Image</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "relative w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden group",
                                                imagePreview ? "border-blue-200 bg-blue-50/20" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                                            )}
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-slate-600">Upload New IMage</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" /> Validity (Days)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium text-slate-900"
                                                value={form.validity_duration}
                                                onChange={(e) => setForm({ ...form, validity_duration: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-emerald-500" /> Package Cost ($)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium text-slate-900"
                                                value={form.cost}
                                                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Package Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 text-lg font-bold outline-none"
                                                    value={form.package_name}
                                                    onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Package Description</label>
                                                <textarea
                                                    rows={4}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium resize-none text-slate-700"
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Service Selection Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs">
                                                <PlusCircle className="w-4 h-4" /> Include Services & Sessions <span className="text-red-500">*</span>
                                            </div>

                                            <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Service to Add</label>
                                                    <select 
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none font-medium text-slate-700 shadow-sm disabled:opacity-50"
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                addService(e.target.value);
                                                                e.target.value = "";
                                                            }
                                                        }}
                                                        disabled={isServicesLoading}
                                                    >
                                                        <option value="">Choose a service...</option>
                                                        {servicesData?.data.map((service) => (
                                                            <option 
                                                                key={service._id} 
                                                                value={service._id}
                                                                disabled={form.services.some(s => s.service_id === service._id)}
                                                            >
                                                                {service.service_name} (${service.cost}/session)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-3 mt-2">
                                                    {form.services.length > 0 ? (
                                                        form.services.map((selected, idx) => {
                                                            const serviceInfo = servicesData?.data.find(s => s._id === selected.service_id);
                                                            return (
                                                                <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 italic">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-slate-800">{serviceInfo?.service_name || "Loading..."}</p>
                                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">${serviceInfo?.cost} / Session</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 transition-all focus-within:border-blue-200 focus-within:bg-white">
                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Sessions:</p>
                                                                            <input 
                                                                                type="number" 
                                                                                min="1"
                                                                                className="w-12 text-center text-sm font-black text-blue-600 bg-transparent outline-none"
                                                                                value={selected.required_sessions}
                                                                                onChange={(e) => updateServiceSessions(selected.service_id, Math.max(1, parseInt(e.target.value) || 1))}
                                                                            />
                                                                        </div>
                                                                        <button 
                                                                            onClick={() => removeService(selected.service_id)}
                                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                                                <PlusCircle className="w-6 h-6" />
                                                            </div>
                                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No services bundled yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Process Overview Sections */}
                                        <div className="pt-6 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                    <Layout className="w-4 h-4 text-blue-500" /> Process Overview Sections
                                                </h2>
                                                <button onClick={addOverview} className="text-blue-600 hover:text-blue-700 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    + Add Section
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                {form.overview.length > 0 ? (
                                                    form.overview.map((section, idx) => (
                                                        <div key={idx} className="relative bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100 space-y-4">
                                                            <button onClick={() => removeOverview(idx)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <input
                                                                placeholder="Section Heading (e.g. Assessment Phase)"
                                                                className="bg-transparent text-slate-900 font-bold border-b border-slate-200 w-full py-1 outline-none focus:border-blue-400 transition-all font-bold"
                                                                value={section.heading}
                                                                onChange={(e) => updateOverview(idx, 'heading', e.target.value)}
                                                            />
                                                            <textarea
                                                                placeholder="Section Description..."
                                                                className="bg-transparent text-slate-600 font-medium text-sm w-full outline-none resize-none pt-2"
                                                                rows={2}
                                                                value={section.description}
                                                                onChange={(e) => updateOverview(idx, 'description', e.target.value)}
                                                            />

                                                            {/* Sub Sections */}
                                                            <div className="pl-6 border-l-2 border-blue-100 space-y-4 pt-2">
                                                                {section.sub_sections.map((sub, sIdx) => (
                                                                    <div key={sIdx} className="flex gap-4 items-start">
                                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                                            <div className="space-y-1">
                                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Heading</p>
                                                                                <input className="w-full text-xs font-bold text-slate-800 outline-none" value={sub.heading} onChange={(e) => updateSubSection(idx, sIdx, 'heading', e.target.value)} />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                                                                                <input className="w-full text-xs font-medium text-slate-500 outline-none" value={sub.description} onChange={(e) => updateSubSection(idx, sIdx, 'description', e.target.value)} />
                                                                            </div>
                                                                        </div>
                                                                        <button onClick={() => removeSubSection(idx, sIdx)} className="p-2 text-slate-300 hover:text-red-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button onClick={() => addSubSection(idx)} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700">
                                                                    + Add Sub-section
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30">
                                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-4">
                                                            <Layout className="w-8 h-8" />
                                                        </div>
                                                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No overview sections added yet</p>
                                                        <p className="text-slate-300 text-xs font-medium mt-1 italic text-center px-4">Click "Add Section" above to define the package process.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Update Package
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
