'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/api';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const res = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            login(res.data.access_token);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
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
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error mb-6 flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Email Field */}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-2"
                    >
                        Sign In
                    </Button>
                </form>

                {/* Divider */}
                <div className="divider my-6"></div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary-light font-medium transition"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
