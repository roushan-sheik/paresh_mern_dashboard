"use client";

import React, { useState } from "react";
import {
    Lock,
    Save,
    Loader2,
    ShieldCheck,
    KeyRound,
    Eye,
    EyeOff
} from "lucide-react";
import { useUpdatePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (form.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            await updatePassword({
                currentPassword: form.oldPassword,
                newPassword: form.newPassword
            }).unwrap();

            toast.success("Password updated successfully!");
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            toast.error(err.data?.message || "Failed to update password");
        }
    };

    const toggleVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1 text-center">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Change Password</h1>
                <p className="text-slate-500 font-medium text-lg">Enhance your account security by updating your password.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPasswords.old ? "text" : "password"}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-slate-900 shadow-sm shadow-transparent focus:shadow-blue-50"
                                value={form.oldPassword}
                                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisibility('old')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-slate-50">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-blue-500" /> New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-slate-900 shadow-sm shadow-transparent focus:shadow-blue-50"
                                    value={form.newPassword}
                                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-slate-900 shadow-sm shadow-transparent focus:shadow-blue-50"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    placeholder="Repeat your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('confirm')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save New Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
