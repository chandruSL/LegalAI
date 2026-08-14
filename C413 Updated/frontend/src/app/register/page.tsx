'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, UserCircle } from 'lucide-react';
import Button from '../../components/Button';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'client'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', formData);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] py-10">
            <div className="glass-panel p-8 md:p-10 w-full max-w-md animate-scale-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Create Account
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Join LegalAI and get started today
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error mb-6 flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                className="input-field pl-10"
                                placeholder="John Doe"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                className="input-field pl-10"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="input-field pl-10 pr-10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {formData.password && (
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-success" />
                                Password must be at least 8 characters
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            I am a...
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'client' })}
                                className={`p-4 rounded-xl border transition flex flex-col items-center gap-2 ${formData.role === 'client'
                                        ? 'border-primary bg-primary/10 shadow-glow'
                                        : 'border-glass-border hover:border-primary/50 hover:bg-white/5'
                                    }`}
                            >
                                <UserCircle size={28} className={formData.role === 'client' ? 'text-primary' : 'text-gray-400'} />
                                <span className={`font-semibold ${formData.role === 'client' ? 'text-primary' : 'text-gray-300'}`}>
                                    Client
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'lawyer' })}
                                className={`p-4 rounded-xl border transition flex flex-col items-center gap-2 ${formData.role === 'lawyer'
                                        ? 'border-primary bg-primary/10 shadow-glow'
                                        : 'border-glass-border hover:border-primary/50 hover:bg-white/5'
                                    }`}
                            >
                                <Briefcase size={28} className={formData.role === 'lawyer' ? 'text-primary' : 'text-gray-400'} />
                                <span className={`font-semibold ${formData.role === 'lawyer' ? 'text-primary' : 'text-gray-300'}`}>
                                    Lawyer
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Divider */}
                <div className="divider my-6"></div>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary-light font-medium transition"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
