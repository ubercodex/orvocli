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

interface PluginData {
  name: string;
  description: string;
  code: string;
  params: Array<{ name: string; type: string; description: string; required: boolean }>;
  tags?: string[];
}

export default function EditPlugin() {
  const { author, name } = useParams<{ author: string; name: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [pluginData, setPluginData] = useState<PluginData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
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
    } catch (err) {
      setError('Failed to load plugin');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text) as PluginData;

      if (data.name !== plugin?.name) {
        throw new Error(`Plugin name mismatch. Expected "${plugin?.name}" but got "${data.name}"`);
      }

      if (!data.description || !data.code) {
        throw new Error('Invalid plugin file: missing required fields');
      }

      setPluginData(data);
    } catch (err: any) {
      setError(err.message || 'Invalid plugin file');
      setFile(null);
      setPluginData(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      const updates: any = {};
      
      // Handle description from input field
      if (description.trim() && description !== plugin?.description) {
        updates.description = description.trim();
      }
      
      // Handle tags from input field
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagsArray.length > 5) {
        throw new Error('Maximum 5 tags allowed');
      }
      if (JSON.stringify(tagsArray.sort()) !== JSON.stringify(plugin?.tags.sort())) {
        updates.tags = tagsArray;
      }
      
      // Handle code from uploaded file (if any)
      if (pluginData && pluginData.code !== plugin?.code) {
        updates.code = pluginData.code;
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
            Update Plugin
          </h1>
          <p className="text-slate-400 text-xl">Update {plugin.name} (v{plugin.version})</p>
          <p className="text-sm text-slate-500 mt-2">
            Export your updated plugin from ZAL CLI and upload the JSON file here.
          </p>
        </div>

        {/* Quick Export Tip */}
        <div className="mb-8 p-6 bg-[#12121a]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl animate-fade-in-up">
          <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Quick Export from ZAL</span>
          </h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>1. Open ZAL and type <code className="px-2 py-1 bg-black/30 rounded text-cyan-400">/plugins</code></p>
            <p>2. Select your plugin and press <kbd className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 font-mono">E</kbd> to export</p>
            <p>3. Upload the exported JSON file below</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Input */}
          <div className="relative group animate-fade-in-up">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Description
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

          {/* Tags Input */}
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

          {/* File Upload */}
          <div className="relative group animate-fade-in-up delay-200">
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Upload Updated Plugin File (optional - for code updates only)
            </label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur group-focus-within:blur-lg transition-all"></div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="relative w-full px-4 py-3 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 file:cursor-pointer focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-green-400">
                ✓ {file.name} loaded
              </p>
            )}
          </div>

          {/* Preview */}
          {plugin && (
            <div className="p-6 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl animate-fade-in-up delay-300">
              <h3 className="text-white font-bold mb-4">Preview Changes</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>
                  <span className="ml-2 text-white">{plugin.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Description:</span>
                  <span className="ml-2 text-slate-300">{description}</span>
                  {description !== plugin.description && (
                    <span className="ml-2 text-yellow-400 text-xs">• Changed</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Tags:</span>
                  <span className="ml-2 text-slate-300">{tags || 'None'}</span>
                  {JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean).sort()) !== JSON.stringify(plugin.tags.sort()) && (
                    <span className="ml-2 text-yellow-400 text-xs">• Changed</span>
                  )}
                </div>
                {pluginData && (
                  <div>
                    <span className="text-slate-500">Code:</span>
                    <span className="ml-2 text-slate-300">{pluginData.code.length} characters</span>
                    {pluginData.code !== plugin.code && (
                      <span className="ml-2 text-yellow-400 text-xs">• Changed (version will auto-increment)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6 animate-fade-in-up delay-200">
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
              className="flex-1 relative group disabled:opacity-50 disabled:cursor-not-allowed"
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
