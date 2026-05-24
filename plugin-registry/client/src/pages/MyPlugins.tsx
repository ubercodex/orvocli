import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'pending' | 'approved' | 'rejected';
  downloads: number;
  tags: string[];
  createdAt: string;
}

export default function MyPlugins() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    fetchMyPlugins();
  }, [user, token, navigate]);

  const fetchMyPlugins = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/plugins?author=${user?.username}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch plugins');

      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">My Plugins</h1>
          <p className="text-slate-400">Manage your published plugins</p>
        </div>

        {plugins.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-3xl blur-2xl"></div>
                <div className="relative text-8xl mb-6">📦</div>
              </div>
              <h2 className="text-3xl font-black text-white mb-4">No Published Plugins Yet</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                You haven't published any plugins yet. Create a tool in Orvo, export it with the <kbd className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 font-mono">E</kbd> key, and upload it!
              </p>
              
              <div className="bg-[#0d0d24]/60 backdrop-blur-xl border border-cyan-500/12 rounded-2xl p-8 mb-8">
                <h3 className="text-white font-bold mb-4 text-left">Quick Start:</h3>
                <div className="space-y-3 text-left text-sm text-slate-300">
                  <div className="flex gap-3">
                    <span className="text-cyan-400 font-bold">1.</span>
                    <span>Open Orvo and type <code className="px-2 py-1 bg-black/30 rounded text-cyan-400">/plugins</code></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>Select "+ New tool" and describe what you want to create</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400 font-bold">3.</span>
                    <span>AI will generate the plugin code for you</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400 font-bold">4.</span>
                    <span>Export from <code className="px-2 py-1 bg-black/30 rounded text-cyan-400">.orvo/plugins.json</code> and upload here</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/publish"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition"
                >
                  📤 Publish Your First Plugin
                </Link>
                <a
                  href="https://github.com/ubercodex/orvocli#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/5 border border-white/12 text-slate-200 font-semibold rounded-xl hover:bg-white/9 transition"
                >
                  📖 Read Guide
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-slate-500 text-sm">
                {plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'}
              </div>
              <Link
                to="/publish"
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm hover:bg-cyan-500/30 transition"
              >
                + New Plugin
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map(plugin => (
                <Link
                  key={plugin.id}
                  to={`/plugins/${user?.username}/${plugin.name}`}
                  className="p-6 bg-[#0d0d24]/60 backdrop-blur-xl border border-cyan-500/12 rounded-2xl hover:border-cyan-500/30 transition block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {plugin.name}
                      </h3>
                      <p className="text-sm text-slate-500">v{plugin.version}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(plugin.status)}`}>
                      <span>{getStatusIcon(plugin.status)}</span>
                      <span className="capitalize">{plugin.status}</span>
                    </div>
                  </div>

                  <p className="text-slate-400 mb-4 line-clamp-2 text-sm">{plugin.description}</p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {plugin.downloads.toLocaleString()} views
                    </div>
                    <div className="text-xs">
                      {new Date(plugin.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {plugin.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20">
                        {tag}
                      </span>
                    ))}
                    {plugin.tags.length > 3 && (
                      <span className="px-2 py-1 text-slate-500 text-xs">
                        +{plugin.tags.length - 3}
                      </span>
                    )}
                  </div>

                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
