import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-[#0F1117] min-h-screen text-[#F0F0F0] font-sans selection:bg-[#4F6EF7]/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#252840]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-[#4F6EF7] flex items-center justify-center shadow-[0_0_20px_rgba(79,110,247,0.4)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#F0F0F0] tracking-tight">WorkFlow</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#8B8FA8]">
            <a href="#features" className="hover:text-[#F0F0F0] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F0F0F0] transition-colors">How it Works</a>
            <a href="#team" className="hover:text-[#F0F0F0] transition-colors">Team</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="hidden md:block text-sm font-medium text-[#8B8FA8] hover:text-[#F0F0F0] transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F6EF7] to-[#7C5CFC] text-white text-sm font-semibold shadow-[0_0_20px_rgba(124,92,252,0.3)] hover:shadow-[0_0_25px_rgba(124,92,252,0.5)] transition-shadow">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F6EF7]/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-3/4 w-[400px] h-[400px] bg-[#7C5CFC]/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#F0F0F0] tracking-tight leading-tight mb-8">
            Automate Your Workflow <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F6EF7] to-[#7C5CFC]">with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8B8FA8] mb-12 max-w-2xl mx-auto leading-relaxed">
            Let AI handle your emails, meetings, calendar and tasks — so you can focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F6EF7] to-[#7C5CFC] text-white text-base font-semibold shadow-[0_0_25px_rgba(124,92,252,0.35)] hover:shadow-[0_0_35px_rgba(124,92,252,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center">
              Get Started 
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#252840] text-[#F0F0F0] text-base font-semibold hover:bg-[#1A1D2E] transition-all flex items-center justify-center group">
              See Demo
              <svg className="w-5 h-5 ml-2 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#141720]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F0F0F0] mb-4">Everything you need</h2>
            <p className="text-[#8B8FA8] text-lg">One intelligent platform to run your daily operations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A1D2E] border border-[#252840] border-t-2 border-t-[#4F6EF7] rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(79,110,247,0.15)] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4F6EF7]/10 flex items-center justify-center mb-6 border border-[#4F6EF7]/20 group-hover:bg-[#4F6EF7]/20 transition-colors">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3">Email Management</h3>
              <p className="text-[#8B8FA8] text-lg leading-relaxed">AI drafts replies, classifies and prioritizes your inbox.</p>
            </div>
            
            <div className="bg-[#1A1D2E] border border-[#252840] border-t-2 border-t-[#34C77B] rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(52,199,123,0.15)] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#34C77B]/10 flex items-center justify-center mb-6 border border-[#34C77B]/20 group-hover:bg-[#34C77B]/20 transition-colors">
                <span className="text-2xl">🗓</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3">Meeting Notes</h3>
              <p className="text-[#8B8FA8] text-lg leading-relaxed">Auto-summarizes meetings and extracts action items.</p>
            </div>
            
            <div className="bg-[#1A1D2E] border border-[#252840] border-t-2 border-t-[#7C5CFC] rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(124,92,252,0.15)] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center mb-6 border border-[#7C5CFC]/20 group-hover:bg-[#7C5CFC]/20 transition-colors">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3">Task Tracking</h3>
              <p className="text-[#8B8FA8] text-lg leading-relaxed">Creates and assigns tasks automatically from your conversations.</p>
            </div>
            
            <div className="bg-[#1A1D2E] border border-[#252840] border-t-2 border-t-[#F5C842] rounded-2xl p-8 hover:shadow-[0_0_25px_rgba(245,200,66,0.15)] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#F5C842]/10 flex items-center justify-center mb-6 border border-[#F5C842]/20 group-hover:bg-[#F5C842]/20 transition-colors">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-2xl font-bold text-[#F0F0F0] mb-3">Smart Reminders</h3>
              <p className="text-[#8B8FA8] text-lg leading-relaxed">Never miss a deadline with intelligent reminders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F0F0F0]">How it works</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-center space-y-12 md:space-y-0 md:space-x-8">
            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A1D2E] border border-[#4F6EF7] flex items-center justify-center text-xl font-bold text-[#4F6EF7] mb-6 shadow-[0_0_15px_rgba(79,110,247,0.2)] group-hover:bg-[#4F6EF7] group-hover:text-white transition-all">
                1
              </div>
              <h4 className="text-xl font-bold text-[#F0F0F0] mb-3">Connect your tools</h4>
              <p className="text-[#8B8FA8]">Link Gmail, Calendar, Notion securely to your agent.</p>
            </div>
            
            <div className="hidden md:block w-16 h-0.5 bg-[#252840] mt-8 relative">
              <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#4F6EF7]"></div>
            </div>

            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A1D2E] border border-[#7C5CFC] flex items-center justify-center text-xl font-bold text-[#7C5CFC] mb-6 shadow-[0_0_15px_rgba(124,92,252,0.2)] group-hover:bg-[#7C5CFC] group-hover:text-white transition-all">
                2
              </div>
              <h4 className="text-xl font-bold text-[#F0F0F0] mb-3">AI processes everything</h4>
              <p className="text-[#8B8FA8]">Agent reads, classifies, and drafts responses in the background.</p>
            </div>
            
            <div className="hidden md:block w-16 h-0.5 bg-[#252840] mt-8 relative">
              <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-[#7C5CFC]"></div>
            </div>

            <div className="flex-1 text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A1D2E] border border-[#34C77B] flex items-center justify-center text-xl font-bold text-[#34C77B] mb-6 shadow-[0_0_15px_rgba(52,199,123,0.2)] group-hover:bg-[#34C77B] group-hover:text-white transition-all">
                3
              </div>
              <h4 className="text-xl font-bold text-[#F0F0F0] mb-3">You approve</h4>
              <p className="text-[#8B8FA8]">Review and confirm actions in one click from your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4F6EF7] to-[#7C5CFC] rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative bg-[#1A1D2E] border border-[#252840] rounded-[2rem] p-12 md:p-20 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F0F0F0] mb-8">Ready to automate your workflow?</h2>
            <Link href="/dashboard" className="px-10 py-5 rounded-xl bg-gradient-to-r from-[#4F6EF7] to-[#7C5CFC] text-white text-lg font-semibold shadow-[0_0_25px_rgba(124,92,252,0.4)] hover:shadow-[0_0_40px_rgba(124,92,252,0.6)] transition-all transform hover:-translate-y-1 inline-block">
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141720] border-t border-[#252840] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-[#8B8FA8] font-medium mb-6 md:mb-0">
            WorkFlow Automation © 2026
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-[#8B8FA8]">
            <Link href="/dashboard" className="hover:text-[#F0F0F0] transition-colors">Dashboard</Link>
            <a href="#features" className="hover:text-[#F0F0F0] transition-colors">Features</a>
            <a href="#" className="hover:text-[#F0F0F0] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
