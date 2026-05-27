import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  author: string;
  name: string;
  description: string;
  tags: string[];
  downloads: number;
  plugin_count: number;
  created_at: string;
}

export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/profiles`)
      .then(res => res.json())
      .then(data => {
        const profiles = (data.profiles || []).map((p: any) => ({
          ...p,
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
        }));
        setProfiles(profiles);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in-down">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight pb-2">
            Plugin Profiles
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Curated collections of plugins for specific use cases
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto animate-fade-in-up">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full px-6 py-4 bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="text-slate-400 mt-4">Loading profiles...</div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="text-slate-400 mb-6 text-lg">
              {searchTerm ? 'No profiles found matching your search' : 'No profiles available yet'}
            </div>
            <Link 
              to="/publish-profile" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Be the first to create a profile
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, index) => (
              <Link
                key={profile.id}
                to={`/profiles/${profile.author}/${profile.name}`}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-pink-600/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Card */}
                <div className="relative bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all mb-2">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500">by {profile.author}</p>
                  </div>

                  <p className="text-slate-400 mb-4 line-clamp-2 text-sm">
                    {profile.description}
                  </p>

                  {profile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {profile.tags.length > 3 && (
                        <span className="px-3 py-1 text-slate-500 text-xs">
                          +{profile.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-purple-500/10">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {profile.plugin_count} plugins
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {profile.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
