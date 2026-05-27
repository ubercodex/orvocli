import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Plugin {
  id: string;
  name: string;
  description: string;
  code: string;
  tags: string[];
  version: string;
  status: string;
}

export default function EditPlugin() {
  const { author, name } = useParams<{ author: string; name: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    if (author !== user.username) {
      navigate('/my-plugins');
      return;
    }

    fetchPlugin();
  }, [user, token, author, name, navigate]);

  const fetchPlugin = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/plugins/${author}/${name}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch plugin');

      const data = await response.json();
      setPlugin(data);
      setDescription(data.description);
      setTags(data.tags.join(', '));
      setCode(data.code);
    } catch (err) {
      setError('Failed to load plugin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      if (tagsArray.length > 5) {
        throw new Error('Maximum 5 tags allowed');
      }

      const updates: any = {};
      
      if (description !== plugin?.description) {
        updates.description = description;
      }
      
      if (tagsArray.join(',') !== plugin?.tags.join(',')) {
        updates.tags = tagsArray;
      }
      
      if (code !== plugin?.code) {
        updates.code = code;
      }

      if (Object.keys(updates).length === 0) {
        setError('No changes detected');
        setSubmitting(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/plugins/${author}/${name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update plugin');
      }

      alert('Plugin updated successfully!' + (updates.code ? ' Version has been auto-incremented.' : ''));
      navigate('/my-plugins');
    } catch (err: any) {
      setError(err.message || 'Failed to update plugin');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Plugin Not Found</h2>
          <button
            onClick={() => navigate('/my-plugins')}
            className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all"
          >
            Back to My Plugins
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight pb-2">
            Edit Plugin
          </h1>
          <p className="text-slate-400 text-xl">Update {plugin.name} (v{plugin.version})</p>
          <p className="text-sm text-slate-500 mt-2">
            Note: Plugin name cannot be changed. Code changes will auto-increment the version.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div className="relative group animate-fade-in-up">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Description *
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur group-focus-within:blur-lg transition-all"></div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
                rows={3}
                placeholder="Describe what your plugin does..."
                className="relative w-full px-4 py-3 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {description.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div className="relative group animate-fade-in-up delay-100">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Tags (comma-separated, max 5)
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur group-focus-within:blur-lg transition-all"></div>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., automation, productivity, utility"
                className="relative w-full px-4 py-3 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Current tags: {tags.split(',').filter(Boolean).length}/5
            </p>
          </div>

          {/* Code */}
          <div className="relative group animate-fade-in-up delay-200">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Code (updating will auto-increment version)
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur group-focus-within:blur-lg transition-all"></div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                rows={15}
                placeholder="Plugin code..."
                className="relative w-full px-4 py-3 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none font-mono text-sm"
              />
            </div>
            {code !== plugin.code && (
              <p className="mt-2 text-sm text-yellow-400">
                ⚠️ Code has been modified. Version will be auto-incremented on save.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 animate-fade-in-up delay-300">
            <button
              type="button"
              onClick={() => navigate('/my-plugins')}
              className="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-200 rounded-xl hover:bg-slate-700 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all">
                {submitting ? 'Updating...' : 'Update Plugin'}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
