"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Droplet,
    ShieldCheck,
    Camera,
    Save,
    Loader2,
    Pencil,
    Layout
} from "lucide-react";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/api/userApi";
import { toast } from "sonner";

export default function ProfilePage() {
    const { data: response, isLoading: isFetching } = useGetMeQuery();
    const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
    const user = response?.data;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        bloodGroup: ""
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                dob: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
                bloodGroup: user.blood_group || ""
            });
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("address", form.address);
            formData.append("date_of_birth", form.dob);
            formData.append("blood_group", form.bloodGroup);

            if (selectedFile) {
                formData.append("user_image", selectedFile);
            }

            await updateMe(formData).unwrap();
            toast.success("Profile updated successfully");
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading Profile...</p>
            </div>
        );
    }

    const displayedImage = localImagePreview || user?.image || "/dashboard/Ellipse.png";

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-1 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mt-1">Personal Information</h1>
                <p className="text-slate-500 font-medium">View and update your profile details and preferences.</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden group">

                        <div className="relative">
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                                <img
                                    src={displayedImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/dashboard/Ellipse.png";
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform active:scale-95 z-10"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                            <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mt-1 italic">{user?.role}</p>
                        </div>

                        <div className="w-full pt-6 border-t border-slate-50">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50/50 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Email</span>
                                <span className="text-sm font-bold text-slate-700">{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form Fields Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] pb-4 border-b border-slate-100">
                            <Layout className="w-4 h-4" /> Profile Details
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Full Name <span className="text-red-500 text-xs">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all font-bold text-slate-900"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email (Disabled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none font-bold text-slate-400 cursor-not-allowed"
                                        value={form.email}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Phone Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all font-bold text-slate-900"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="Add phone number"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all font-bold text-slate-900"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        placeholder="Add location"
                                    />
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Date of Birth
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all font-bold text-slate-900 custom-date-input"
                                        value={form.dob}
                                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Blood Group */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                    Blood Group
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                        <Droplet className="w-4 h-4" />
                                    </div>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all font-bold text-slate-900 appearance-none"
                                        value={form.bloodGroup}
                                        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                                    >
                                        <option value="">Select Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95"
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isUpdating ? "Saving Changes..." : "Save Profile Details"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
