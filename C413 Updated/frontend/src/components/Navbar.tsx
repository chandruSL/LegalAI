'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Scale, LogOut, User, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-primary font-bold text-xl md:text-2xl hover:opacity-80 transition"
                    >
                        <Scale size={28} />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            LegalAI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-white font-medium transition"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-3 text-sm text-gray-400 border-l border-gray-700 pl-6">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm">{user.full_name}</span>
                                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-error hover:bg-error/10 transition"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white font-medium transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/5 transition"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-glass-border animate-fade-in-down">
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{user.full_name}</span>
                                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/5 transition text-gray-300"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-error/10 text-error transition w-full text-left"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg hover:bg-white/5 transition text-gray-300 text-center"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-primary text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
