'use client';

import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Link as LinkIcon, Briefcase, Send, Sparkles, Star, TrendingUp, Phone, Mail } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import EmptyState from './EmptyState';
import { ListSkeleton } from './LoadingSkeleton';
import ReactMarkdown from 'react-markdown';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'chat' | 'lawyer' | 'cases'>('chat');

    // State for Chat
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State for Linking
    const [lawyers, setLawyers] = useState<any[]>([]);
    const [lawyersLoading, setLawyersLoading] = useState(false);

    // State for Cases
    const [cases, setCases] = useState<any[]>([]);
    const [casesLoading, setCasesLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'lawyer') fetchLawyers();
        if (activeTab === 'cases') fetchCases();
    }, [activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchLawyers = async () => {
        setLawyersLoading(true);
        try {
            const res = await api.get('/users/lawyers');
            setLawyers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLawyersLoading(false);
        }
    };

    const linkLawyer = async (lawyerId: number) => {
        try {
            await api.post(`/users/link/${lawyerId}`);
            alert('Successfully connected with lawyer!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Failed to connect. Please try again.');
        }
    };

    const fetchCases = async () => {
        setCasesLoading(true);
        try {
            const res = await api.get('/cases/');
            setCases(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setCasesLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);
        setInput('');

        try {
            const res = await api.post('/ai/chat', { message: userMessage });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Error: Unable to connect to AI assistant." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 flex flex-col gap-3">
                <div className="glass-panel p-4 mb-2">
                    <h2 className="font-bold text-lg mb-1 text-gray-900">Client Portal</h2>
                    <p className="text-xs text-gray-600">Manage your legal matters</p>
                </div>

                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-3 p-4 rounded-xl transition ${activeTab === 'chat'
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                        : 'glass-panel hover:bg-white/5'
                        }`}
                >
                    <MessageSquare size={20} />
                    <span className="font-medium">AI Legal Assistant</span>
                </button>

                <button
                    onClick={() => setActiveTab('lawyer')}
                    className={`flex items-center gap-3 p-4 rounded-xl transition ${activeTab === 'lawyer'
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                        : 'glass-panel hover:bg-white/5'
                        }`}
                >
                    <LinkIcon size={20} />
                    <span className="font-medium">Find Lawyer</span>
                </button>

                <button
                    onClick={() => setActiveTab('cases')}
                    className={`flex items-center gap-3 p-4 rounded-xl transition ${activeTab === 'cases'
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                        : 'glass-panel hover:bg-white/5'
                        }`}
                >
                    <Briefcase size={20} />
                    <span className="font-medium">My Cases</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                {activeTab === 'chat' && (
                    <div className="glass-panel flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="p-6 border-b border-glass-border">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">AI Legal Assistant</h2>
                                    <p className="text-xs text-gray-600">Powered by Gemini 1.5 • Indian Law Domain</p>
                                </div>
                            </div>
                            <div className="bg-warning/10 border border-warning/20 rounded-lg px-3 py-2 mt-3">
                                <p className="text-xs text-warning-light">
                                    ⚠️ For informational purposes only. Not legal advice.
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <EmptyState
                                    icon={<MessageSquare size={48} />}
                                    title="Start a Conversation"
                                    description="Ask any legal question related to Indian law. I'm here to help you understand your rights and options."
                                />
                            )}

                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                    <div className={`max-w-[85%] md:max-w-[75%] ${m.role === 'user'
                                        ? 'bg-gradient-to-br from-primary to-accent text-white rounded-2xl rounded-br-md p-4 shadow-md'
                                        : 'bg-secondary/80 border border-glass-border rounded-2xl rounded-bl-md p-4'
                                        }`}>
                                        {m.role === 'ai' ? (
                                            <div className="prose prose-sm prose-invert max-w-none">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-secondary/80 border border-glass-border rounded-2xl rounded-bl-md p-4 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                        <span className="text-sm text-gray-400">AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-glass-border">
                            <div className="flex gap-3">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your legal question..."
                                    className="input-field flex-1"
                                    disabled={chatLoading}
                                />
                                <Button type="submit" disabled={chatLoading || !input.trim()} icon={<Send size={18} />}>
                                    Send
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'lawyer' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Find Your Lawyer</h2>
                                <p className="text-gray-600 text-sm mt-1">Connect with verified legal professionals</p>
                            </div>
                        </div>

                        {lawyersLoading ? (
                            <ListSkeleton count={3} />
                        ) : lawyers.length === 0 ? (
                            <EmptyState
                                icon={<LinkIcon size={48} />}
                                title="No Lawyers Available"
                                description="There are currently no lawyers registered in the system. Please check back later."
                            />
                        ) : (
                            <div className="grid gap-6">
                                {lawyers.map(l => (
                                    <div key={l.id} className="card flex flex-col lg:flex-row gap-6">
                                        {/* Lawyer Avatar */}
                                        <div className="shrink-0">
                                            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                                                {l.full_name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Lawyer Info */}
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{l.full_name}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail size={14} />
                                                            <span>{l.email}</span>
                                                        </div>
                                                    </div>
                                                    {l.specialization && (
                                                        <Badge variant="info">
                                                            {l.specialization}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-3 gap-4 p-4 bg-black/20 rounded-lg">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-success mb-1">
                                                        ₹{l.hourly_fee || '--'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Per Hour</div>
                                                </div>
                                                <div className="text-center border-x border-glass-border">
                                                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                                                        <Star size={16} fill="currentColor" />
                                                        <span className="text-2xl font-bold">{l.rating || '--'}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">Rating</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <TrendingUp size={16} className="text-blue-400" />
                                                        <span className="text-2xl font-bold text-blue-400">{l.success_rate || '--'}%</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">Success Rate</div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex justify-end">
                                                {user?.linked_lawyer_id === l.id ? (
                                                    <Button variant="outline" disabled className="cursor-not-allowed">
                                                        ✓ Connected
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => linkLawyer(l.id)}
                                                        className="bg-gradient-to-r from-success to-emerald-600"
                                                    >
                                                        Connect Now
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'cases' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">My Cases</h2>
                            <p className="text-gray-600 text-sm mt-1">Track your legal matters and case progress</p>
                        </div>

                        {casesLoading ? (
                            <ListSkeleton count={3} />
                        ) : cases.length === 0 ? (
                            <EmptyState
                                icon={<Briefcase size={48} />}
                                title="No Active Cases"
                                description="You don't have any cases yet. Once your lawyer creates a case for you, it will appear here."
                            />
                        ) : (
                            <div className="grid gap-4">
                                {cases.map(c => (
                                    <div key={c.id} className="card">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-primary mb-2">{c.title}</h3>
                                                <p className="text-gray-600 text-sm">{c.description}</p>
                                            </div>
                                            <Badge variant={c.status === 'active' ? 'success' : c.status === 'pending' ? 'warning' : 'primary'}>
                                                {c.status}
                                            </Badge>
                                        </div>

                                        {c.prediction_result && (
                                            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                                <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                                                    <Sparkles size={14} />
                                                    AI Case Analysis
                                                </p>
                                                <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                                                    <ReactMarkdown>{c.prediction_result}</ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
