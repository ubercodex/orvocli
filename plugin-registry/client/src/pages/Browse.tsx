import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Plugin {
  id: string;
  author: string;
  name: string;
  description: string;
  downloads: number;
  tags: string[];
}

export default function Browse() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/plugins`)
      .then(res => res.json())
      .then(data => {
        setPlugins(data.plugins || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = plugins.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#03030d] text-slate-200">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/8 bg-[#03030d]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-600">
              <span className="text-white font-bold text-sm font-mono">O</span>
            </div>
            <span className="font-bold text-white">ZAL</span>
            <span className="text-slate-500 text-sm">Plugin Registry</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24 pt-32">
        <h1 className="text-5xl font-black mb-4 text-white">Browse Plugins</h1>
        <p className="text-slate-400 mb-8">Discover community-built tools to supercharge your terminal</p>
        
        <input
          type="text"
          placeholder="Search by name, author, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-6 py-4 bg-[#0d0d24]/60 border border-cyan-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition backdrop-blur-xl"
        />

        {loading ? (
          <div className="text-center py-32 text-slate-500">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <div>Loading plugins...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-slate-400 text-lg">
              {search ? 'No plugins found matching your search' : 'No plugins available yet. Be the first to publish!'}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map(plugin => (
              <Link
                key={plugin.id}
                to={`/plugins/${plugin.author}/${plugin.name}`}
                className="p-6 bg-[#0d0d24]/60 backdrop-blur-xl border border-cyan-500/12 rounded-2xl hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                      {plugin.name}
                    </h3>
                    <p className="text-sm text-slate-500">by {plugin.author}</p>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {plugin.downloads.toLocaleString()} views
                  </div>
                </div>
                <p className="text-slate-400 mb-4 line-clamp-2 text-sm">{plugin.description}</p>
                <div className="flex flex-wrap gap-2">
                  {plugin.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
