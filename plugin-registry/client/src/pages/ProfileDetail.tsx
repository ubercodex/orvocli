import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface Plugin {
  id: string;
  author: string;
  name: string;
  description: string;
  version: string;
}

interface Profile {
  id: string;
  author: string;
  name: string;
  description: string;
  tags: string[];
  system_prompt?: string;
  downloads: number;
  plugins: Plugin[];
  created_at: string;
  updated_at: string;
}

export default function ProfileDetail() {
  const { author, name } = useParams<{ author: string; name: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/profiles/${author}/${name}`)
      .then(res => res.json())
      .then(data => {
        const profile = {
          ...data,
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags,
        };
        setProfile(profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [author, name]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-6xl mb-6 animate-pulse-glow">📋</div>
          <div className="text-slate-400 mb-6 text-lg">Profile not found</div>
          <Link 
            to="/profiles" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-purple-400 mb-8 transition-colors animate-fade-in-down"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight pb-2">
            {profile.name}
          </h1>
          <p className="text-2xl text-slate-400">by {profile.author}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-100">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
              <div className="text-sm text-slate-500 mb-2">Plugins</div>
              <div className="text-2xl font-bold text-white">{profile.plugins.length}</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
              <div className="text-sm text-slate-500 mb-2">Views</div>
              <div className="text-2xl font-bold text-white">{profile.downloads.toLocaleString()}</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
              <div className="text-sm text-slate-500 mb-2">Updated</div>
              <div className="text-2xl font-bold text-white">
                {new Date(profile.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-8 animate-fade-in-up delay-200">
          <h2 className="text-3xl font-bold text-white mb-4">Description</h2>
          <p className="text-slate-300 text-lg leading-relaxed">{profile.description}</p>
        </div>

        {/* System Prompt */}
        {profile.system_prompt && (
          <div className="bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-8 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold text-white mb-4">System Prompt</h2>
            <div className="bg-[#0a0a0f] rounded-xl p-6 border border-purple-500/30">
              <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">{profile.system_prompt}</pre>
            </div>
            <p className="text-sm text-slate-500 mt-4 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This profile includes custom AI behavior instructions that will be applied when using it.</span>
            </p>
          </div>
        )}

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="mb-8 animate-fade-in-up delay-400">
            <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {profile.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-xl text-sm font-medium hover:bg-purple-500/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Installation */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-8 animate-fade-in-up delay-500">
          <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 mb-3 font-medium">Install this profile:</p>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#0a0a0f] rounded-xl p-6 font-mono text-base border border-purple-500/30">
                  <span className="text-purple-400">zal /profiles install {author}-{profile.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-400 mb-3 font-medium">Install and set as default:</p>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-[#0a0a0f] rounded-xl p-6 font-mono text-base border border-purple-500/30">
                  <span className="text-purple-400">zal /profiles install-default {author}-{profile.name.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Included Plugins */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 animate-fade-in-up delay-500">
          <h2 className="text-3xl font-bold text-white mb-6">Included Plugins ({profile.plugins.length})</h2>
          <div className="space-y-3">
            {profile.plugins.map((plugin, index) => (
              <Link
                key={plugin.id}
                to={`/plugins/${plugin.author}/${plugin.name}`}
                className="block p-5 bg-[#0a0a0f]/50 border border-purple-500/20 rounded-xl hover:border-purple-500/40 hover:bg-[#0a0a0f]/80 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-slate-500 text-sm font-mono">#{index + 1}</span>
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{plugin.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded">v{plugin.version}</span>
                    </div>
                    <p className="text-sm text-slate-400">{plugin.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-purple-400 ml-4 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
