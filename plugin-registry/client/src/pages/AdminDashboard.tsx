import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PendingPlugin {
  id: string;
  author: string;
  name: string;
  version: string;
  description: string;
  code: string;
  tags: string[];
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [plugins, setPlugins] = useState<PendingPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<PendingPlugin | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    fetchPendingPlugins();
  }, [user, token, navigate]);

  const fetchPendingPlugins = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/admin/plugins/pending`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert('You are not an admin');
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch pending plugins');
      }

      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this plugin?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/admin/plugins/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to approve plugin');

      alert('Plugin approved!');
      setSelectedPlugin(null);
      fetchPendingPlugins();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this plugin?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/admin/plugins/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to reject plugin');

      alert('Plugin rejected!');
      setSelectedPlugin(null);
      fetchPendingPlugins();
    } catch (err) {
      alert((err as Error).message);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Review and approve pending plugins</p>
        </div>

        {plugins.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-slate-400 text-lg">No pending plugins to review</div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Plugin List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Pending Plugins ({plugins.length})</h2>
              {plugins.map(plugin => (
                <button
                  key={plugin.id}
                  onClick={() => setSelectedPlugin(plugin)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedPlugin?.id === plugin.id
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-[#0d0d24]/60 border-cyan-500/12 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold">{plugin.name}</h3>
                      <p className="text-sm text-slate-500">by {plugin.author}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(plugin.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{plugin.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {plugin.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Plugin Detail */}
            {selectedPlugin ? (
              <div className="bg-[#0d0d24]/60 border border-cyan-500/12 rounded-xl p-6 sticky top-24 h-fit">
                <h2 className="text-2xl font-bold text-white mb-4">{selectedPlugin.name}</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-slate-500 text-sm">Author</label>
                    <p className="text-white">{selectedPlugin.author}</p>
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm">Description</label>
                    <p className="text-white">{selectedPlugin.description}</p>
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPlugin.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 text-sm">Code</label>
                    <pre className="mt-2 p-4 bg-[#050510] border border-cyan-500/20 rounded-lg text-white text-xs overflow-x-auto max-h-64">
                      {selectedPlugin.code}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedPlugin.id)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedPlugin.id)}
                    className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#0d0d24]/60 border border-cyan-500/12 rounded-xl p-6 flex items-center justify-center h-64">
                <p className="text-slate-500">Select a plugin to review</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
