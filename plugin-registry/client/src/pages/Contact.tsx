export default function Contact() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-block px-4 py-2 mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            Get in Touch
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight pb-2">
            We're here to help
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Have questions? Found a bug? Want to contribute? Choose your preferred way to reach out.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 animate-fade-in-up">
          {/* GitHub Issues */}
          <a
            href="https://github.com/ubercodex/zalcli/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-500/15 border border-purple-500/30 group-hover:bg-purple-500/25 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2 text-xl group-hover:text-cyan-400 transition-colors">GitHub Issues</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  Report bugs, request features, or ask technical questions on our GitHub repository.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  Open an issue
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:support@zalcli.com"
            className="block bg-[#12121a]/80 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-pink-500/15 border border-pink-500/30 group-hover:bg-pink-500/25 transition-colors">
                <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2 text-xl group-hover:text-violet-400 transition-colors">Email Support</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  For private inquiries, partnership opportunities, or general questions, drop us an email.
                </p>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-medium">
                  Send an email
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl animate-fade-in-up delay-200">
          <h2 className="text-3xl font-bold text-white mb-6">More Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://github.com/ubercodex/zalcli#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors">Documentation</div>
                <div className="text-slate-500 text-xs">Installation, usage, and API reference</div>
              </div>
            </a>

            <a
              href="https://github.com/ubercodex/zalcli/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-violet-400 transition-colors">Discussions</div>
                <div className="text-slate-500 text-xs">Community Q&A and announcements</div>
              </div>
            </a>

            <a
              href="https://github.com/ubercodex/zalcli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors">Source Code</div>
                <div className="text-slate-500 text-xs">Contribute on GitHub</div>
              </div>
            </a>

            <a
              href="https://github.com/ubercodex/zalcli/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1">
                <div className="text-white font-semibold group-hover:text-violet-400 transition-colors">License</div>
                <div className="text-slate-500 text-xs">MIT License - Open Source</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
