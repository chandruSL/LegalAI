'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, Plus, Upload, BrainCircuit, FileText, File, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import EmptyState from './EmptyState';
import { ListSkeleton } from './LoadingSkeleton';

export default function LawyerDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'clients' | 'cases'>('cases');
    const [clients, setClients] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [clientsLoading, setClientsLoading] = useState(false);
    const [casesLoading, setCasesLoading] = useState(false);

    // Case Creation
    const [showCreate, setShowCreate] = useState(false);
    const [newCase, setNewCase] = useState({ title: '', description: '', client_id: '' });

    // Upload & Predict
    const [uploading, setUploading] = useState<number | null>(null);
    const [predicting, setPredicting] = useState<number | null>(null);
    const [predictionResult, setPredictionResult] = useState<{ caseId: number, text: string } | null>(null);

    useEffect(() => {
        fetchClients();
        fetchCases();
    }, []);

    const fetchClients = async () => {
        setClientsLoading(true);
        try {
            const res = await api.get('/users/my-clients');
            setClients(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setClientsLoading(false);
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

    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCase.client_id) return alert('Please select a client');

        try {
            await api.post(`/cases/?client_id=${newCase.client_id}`, {
                title: newCase.title,
                description: newCase.description
            });
            setShowCreate(false);
            setNewCase({ title: '', description: '', client_id: '' });
            fetchCases();
        } catch (err) {
            alert('Failed to create case. Please try again.');
        }
    };

    const handleUpload = async (caseId: number, file: File) => {
        setUploading(caseId);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/cases/${caseId}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Document uploaded successfully!');
            fetchCases();
        } catch (err) {
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    const handleDelete = async (caseId: number, docId: number) => {
        if (!confirm("Delete this document?")) return;

        try {
            await api.delete(`/cases/${caseId}/documents/${docId}`);
            alert('Document deleted');
            fetchCases();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handlePredict = async (caseId: number) => {
        setPredicting(caseId);
        try {
            const res = await api.post(`/ai/predict/${caseId}`);
            setPredictionResult({ caseId, text: res.data.response });
            fetchCases(); // Refresh to get updated prediction
        } catch (err) {
            alert('Prediction failed. Ensure a document is uploaded.');
        } finally {
            setPredicting(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex flex-col gap-3">
                <div className="glass-panel p-4 mb-2">
                    <h2 className="font-bold text-lg mb-1 text-gray-900">Lawyer Portal</h2>
                    <p className="text-xs text-gray-600">Manage cases & clients</p>
                </div>

                <button
                    onClick={() => setActiveTab('cases')}
                    className={`flex items-center gap-3 p-4 rounded-xl transition ${activeTab === 'cases'
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                        : 'glass-panel hover:bg-white/5'
                        }`}
                >
                    <Briefcase size={20} />
                    <span className="font-medium">Case Management</span>
                </button>

                <button
                    onClick={() => setActiveTab('clients')}
                    className={`flex items-center gap-3 p-4 rounded-xl transition ${activeTab === 'clients'
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                        : 'glass-panel hover:bg-white/5'
                        }`}
                >
                    <Users size={20} />
                    <span className="font-medium">My Clients</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {activeTab === 'clients' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-1 text-gray-900">Connected Clients</h3>
                            <p className="text-gray-600 text-sm">Manage your client relationships</p>
                        </div>

                        {clientsLoading ? (
                            <ListSkeleton count={3} />
                        ) : clients.length === 0 ? (
                            <EmptyState
                                icon={<Users size={48} />}
                                title="No Clients Yet"
                                description="When clients connect with you, they will appear here."
                            />
                        ) : (
                            <div className="grid gap-4">
                                {clients.map(c => (
                                    <div key={c.id} className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                                {c.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{c.full_name}</p>
                                                <p className="text-sm text-gray-600">{c.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'cases' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-2xl font-bold mb-1 text-gray-900">Case Docket</h3>
                                <p className="text-gray-600 text-sm">Manage and analyze your cases</p>
                            </div>
                            <Button
                                onClick={() => setShowCreate(!showCreate)}
                                icon={<Plus size={18} />}
                            >
                                New Case
                            </Button>
                        </div>

                        {/* Create Case Form */}
                        {showCreate && (
                            <form onSubmit={handleCreateCase} className="glass-panel p-6 animate-scale-in space-y-4">
                                <h4 className="font-bold text-lg mb-4">Create New Case</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Case Title</label>
                                    <input
                                        placeholder="Enter case title"
                                        className="input-field"
                                        value={newCase.title}
                                        onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        placeholder="Describe the case details"
                                        className="input-field min-h-[100px]"
                                        value={newCase.description}
                                        onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Assign to Client</label>
                                    <select
                                        className="input-field"
                                        value={newCase.client_id}
                                        onChange={e => setNewCase({ ...newCase, client_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a client</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit">Create Case</Button>
                                    <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Cases List */}
                        {casesLoading ? (
                            <ListSkeleton count={2} />
                        ) : cases.length === 0 ? (
                            <EmptyState
                                icon={<Briefcase size={48} />}
                                title="No Cases Created"
                                description="Create your first case to get started with case management and AI predictions."
                                action={
                                    <Button onClick={() => setShowCreate(true)} icon={<Plus size={18} />}>
                                        Create First Case
                                    </Button>
                                }
                            />
                        ) : (
                            <div className="grid gap-6">
                                {cases.map(c => (
                                    <div key={c.id} className="card">
                                        {/* Case Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-primary mb-2">{c.title}</h4>
                                                <p className="text-gray-600 text-sm">{c.description}</p>
                                            </div>
                                            <Badge variant={c.status === 'active' ? 'success' : 'primary'}>
                                                {c.status}
                                            </Badge>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-6">
                                            {/* Left Column: Actions */}
                                            <div className="space-y-4">
                                                {/* Upload Documents */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                                        Documents
                                                    </label>
                                                    <label className="flex items-center justify-center gap-3 cursor-pointer bg-secondary hover:bg-secondary/80 p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-primary transition group">
                                                        <Upload size={20} className="text-gray-400 group-hover:text-primary transition" />
                                                        <span className="text-sm text-gray-300 group-hover:text-white transition">
                                                            {uploading === c.id ? 'Uploading...' : 'Upload Case PDF'}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf"
                                                            onClick={(e) => (e.currentTarget.value = '')}
                                                            onChange={(e) => e.target.files && handleUpload(c.id, e.target.files[0])}
                                                        />
                                                    </label>
                                                </div>

                                                {/* Document List */}
                                                {c.documents && c.documents.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Uploaded Files</p>
                                                        {c.documents.map((d: any) => (
                                                            <div key={d.id} className="flex items-center justify-between gap-3 bg-black/30 p-3 rounded-lg group hover:bg-black/40 transition">
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <File size={16} className="text-primary shrink-0" />
                                                                    <span className="truncate text-sm text-gray-300">{d.filename}</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(c.id, d.id)}
                                                                    className="text-gray-500 hover:text-error transition shrink-0"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Predict Button */}
                                                <Button
                                                    onClick={() => handlePredict(c.id)}
                                                    loading={predicting === c.id}
                                                    disabled={!c.documents || c.documents.length === 0}
                                                    icon={<BrainCircuit size={18} />}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                                                >
                                                    {predicting === c.id ? 'Analyzing...' : 'Generate AI Prediction'}
                                                </Button>

                                                {!c.documents || c.documents.length === 0 && (
                                                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-warning/5 p-3 rounded-lg border border-warning/20">
                                                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                        <span>Upload at least one document to generate predictions</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column: Results */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                                                    AI Analysis Results
                                                </p>
                                                <div className="bg-black/30 p-5 rounded-lg min-h-[250px] border border-glass-border">
                                                    {(predictionResult?.caseId === c.id || c.prediction_result) ? (
                                                        <div className="h-full flex flex-col animate-fade-in">
                                                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-glass-border">
                                                                <BrainCircuit size={18} className="text-accent" />
                                                                <p className="font-bold text-accent">Advisory Opinion</p>
                                                                <CheckCircle size={16} className="text-success ml-auto" />
                                                            </div>
                                                            <div className="overflow-y-auto max-h-[400px] prose prose-sm max-w-none">
                                                                <ReactMarkdown>
                                                                    {predictionResult?.caseId === c.id ? predictionResult?.text : c.prediction_result}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                                                            <FileText size={40} className="mb-3 opacity-50" />
                                                            <p className="text-sm">No prediction generated yet</p>
                                                            <p className="text-xs mt-1">Upload documents and click 'Generate Prediction'</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
