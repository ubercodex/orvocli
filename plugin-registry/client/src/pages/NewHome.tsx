import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NewHome() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-up">
              <div className="inline-block px-4 py-2 mb-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                AI-Powered Terminal
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
                <span className="text-white">Your terminal.</span><br/>
                <span className="bg-gradient-to-r from-cyan-300 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Supercharged.</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                An AI-powered terminal assistant built with Ink and TypeScript. Chat with multiple LLM providers, 
                create custom tools with AI, and manage tool profiles — all from your terminal.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/registry"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                >
                  Browse Plugins →
                </Link>
                <a
                  href="https://github.com/ubercodex/orvocli#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/12 text-slate-200 hover:bg-white/9 transition-all"
                >
                  Documentation
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4 flex-wrap">
                <span className="text-slate-600 text-xs uppercase tracking-widest font-semibold">Works with</span>
                <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/8 text-cyan-400 border border-cyan-500/20 rounded-full">Anthropic</span>
                <span className="px-3 py-1 text-xs font-semibold bg-indigo-500/8 text-indigo-400 border border-indigo-500/20 rounded-full">Google</span>
                <span className="px-3 py-1 text-xs font-semibold bg-violet-500/8 text-violet-400 border border-violet-500/20 rounded-full">OpenAI</span>
              </div>
            </div>

            {/* Right: Terminal mockup */}
            <div className="animate-float">
              <div className="bg-[#050510] border border-cyan-500/25 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/8">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-cyan-500/12 bg-cyan-500/3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-slate-500 font-mono">orvo /plugins</span>
                </div>
                <div className="p-5 font-mono text-sm leading-7">
                  <div><span className="text-slate-500">$</span> <span className="text-cyan-400">orvo</span></div>
                  <div className="text-slate-500 text-xs">Orvo v0.1.2 · claude-sonnet-4-5</div>
                  <div className="mt-2"><span className="text-slate-500">&gt;</span> <span className="text-white">/plugins</span></div>
                  <div className="text-slate-500 text-xs mt-1">→ + New tool</div>
                  <div className="mt-2 text-slate-300 text-xs">Describe what the tool should do:</div>
                  <div className="text-violet-400 text-xs">Calculate compound interest with principal and rate</div>
                  <div className="mt-1 text-slate-500 text-xs">⟳ Generating with AI...</div>
                  <div className="text-cyan-400 text-xs mt-1">✓ <span className="text-slate-300">Created</span> <span className="text-green-400">calculateInterest.ts</span></div>
                  <div className="mt-2 text-slate-300 text-xs">Tool ready! Now you can calculate interest.</div>
                  <div className="mt-3"><span className="text-slate-500">&gt;</span> <span className="animate-blink text-cyan-400">▌</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-5 transition-all duration-600">
            <div className="inline-block px-4 py-2 mb-4 bg-cyan-500/8 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Everything you need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to enhance your terminal workflow
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🤖', title: 'Multi-Provider AI', desc: 'Switch between multiple AI providers and models. Configure your preferred provider and start chatting.' },
              { icon: '🔌', title: 'Plugin System', desc: 'Create custom tools by describing what you want. AI generates the code for you.' },
              { icon: '📦', title: 'Tool Profiles', desc: 'Group tools into named profiles. Activate a profile to restrict AI to only those tools.' },
              { icon: '💾', title: 'Workspace Memory', desc: 'Two-layer memory system: shared baseline + per-branch overlay for git repos.' },
              { icon: '🎨', title: 'Multiple Themes', desc: 'Choose from multiple color themes to customize your terminal experience.' },
              { icon: '🔐', title: 'Encrypted Keys', desc: 'API keys stored with strong encryption, derived from your machine identity.' },
            ].map((feature, i) => (
              <div key={i} className="reveal opacity-0 translate-y-5 transition-all duration-600 bg-[#0d0d24]/60 backdrop-blur-xl border border-cyan-500/12 rounded-2xl p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center reveal opacity-0 translate-y-5 transition-all duration-600">
          <div className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-3xl p-12">
            <h2 className="text-4xl font-black text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Install Orvo and start building with AI-powered tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/ubercodex/orvocli#installation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
              >
                Install Now
              </a>
              <Link
                to="/registry"
                className="px-8 py-4 rounded-xl font-semibold bg-white/5 border border-white/12 text-slate-200 hover:bg-white/9 transition-all"
              >
                Browse Plugins
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-fade-up { animation: fade-up 0.6s ease-out both; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-blink { animation: blink 1.1s step-end infinite; }
        .reveal.visible { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </div>
  );
}
