'use client';

import Link from 'next/link';
import { Shield, Brain, Users, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-8 mt-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-sm animate-fade-in-up">
          <Sparkles size={16} className="text-accent" />
          <span className="text-gray-700">Powered by</span>
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Gemini AI 1.5
          </span>
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 pb-2 px-4 leading-tight">
          Legal Assistance <br className="hidden sm:block" /> Reimagined.
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed px-4">
          The secure, AI-powered platform bridging the gap between clients and legal professionals.
          Get instant guidance, manage cases, and predict outcomes with precision.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/register"
            className="btn-primary text-base md:text-lg px-8 py-4 group"
          >
            <span>Get Started</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="btn-secondary text-base md:text-lg px-8 py-4"
          >
            Sign In
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-success" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-success" />
            <span>Role-Based Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-success" />
            <span>AI-Powered Insights</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <FeatureCard
          icon={<Brain size={32} className="text-accent" />}
          title="AI Case Prediction"
          desc="Upload case documents and let our Gemini-powered engine analyze facts to predict win probability with detailed advisory opinions."
        />
        <FeatureCard
          icon={<Shield size={32} className="text-primary" />}
          title="Secure Client-Lawyer Linking"
          desc="Establish a private, encrypted connection between Client and Lawyer. Your data is strictly isolated and protected."
        />
        <FeatureCard
          icon={<Users size={32} className="text-blue-400" />}
          title="Role-Based Portals"
          desc="Dedicated dashboards for Clients to seek help and Lawyers to manage their caseload efficiently with intelligent tools."
        />
      </section>

      {/* How It Works */}
      <section className="glass-panel p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StepCard number="1" title="Sign Up" description="Register as a client or lawyer with secure credentials" />
          <StepCard number="2" title="Connect" description="Clients can browse and connect with verified lawyers" />
          <StepCard number="3" title="Collaborate" description="Share case details, documents, and communicate securely" />
          <StepCard number="4" title="Predict" description="Get AI-powered case outcome predictions based on uploaded documents" />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to get started?</h3>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join LegalAI today and experience the future of legal assistance.
        </p>
        <Link
          href="/register"
          className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
        >
          Create Free Account
          <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="card group">
      <div className="bg-secondary/50 w-fit p-4 rounded-xl border border-glass-border mb-4 group-hover:border-primary/50 transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mb-4">
        {number}
      </div>
      <h4 className="font-bold text-lg mb-2 text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
