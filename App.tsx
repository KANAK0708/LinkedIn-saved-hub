import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { TopNavbar } from './components/TopNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { SavedPostCard } from './components/SavedPostCard';
import { savedPosts } from './components/savedPostsData';
import { ReminderBanner } from './components/ReminderBanner';
import { StatsPanel } from './components/StatsPanel';

const HISTORY_KEY = 'li_search_history';

export default function App() {
  const [activeTab, setActiveTab] = useState<'All' | 'Articles'>('All');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Dark mode: toggle .dark class on <html> ───────────────────────────────
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1b1f23';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F4F2EE';
    }
  }, [isDark]);

  // ── Close search on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const commitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) { setSearchOpen(false); return; }
    setSearchQuery(trimmed);
    setSearchInput(trimmed);
    const updated = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, 8);
    setSearchHistory(updated);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
    setSearchOpen(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
  };

  // ── Filter posts ──────────────────────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    let result = savedPosts;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.author.name.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.author.title || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, searchQuery]);

  // ── Old posts (>7 days) ───────────────────────────────────────────────────
  const oldPostCount = useMemo(() =>
    savedPosts.filter(p => Date.now() - new Date(p.date).getTime() > 7 * 24 * 60 * 60 * 1000).length
  , []);

  const filteredHistory = searchHistory.filter(h =>
    !searchInput || h.toLowerCase().includes(searchInput.toLowerCase())
  );

  const bg = isDark ? '#1b1f23' : '#F4F2EE';
  const cardBg = isDark ? '#242a31' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const textPrimary = isDark ? '#e7e7e7' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const pillBorder = isDark ? '#4b5563' : '#d1d5db';
  const pillInactive = isDark ? '#2c3340' : '#ffffff';
  const pillInactiveText = isDark ? '#d1d5db' : '#374151';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: textPrimary }}>
      <TopNavbar isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <div className="max-w-[1128px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          <LeftSidebar isDark={isDark} />

          <main className="flex-1 min-w-0">
            {/* Reminder Banner */}
            {oldPostCount > 0 && <ReminderBanner count={oldPostCount} isDark={isDark} />}

            <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: cardBg, borderColor }}>
              <div className="px-5 pt-5 pb-3">
                <h1 className="text-xl font-semibold mb-4" style={{ color: textPrimary }}>Saved Posts</h1>

                {/* Filter pills + search icon */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(['All', 'Articles'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: activeTab === tab ? '#057642' : pillInactive,
                        color: activeTab === tab ? '#ffffff' : pillInactiveText,
                        border: activeTab === tab ? 'none' : `1px solid ${pillBorder}`,
                      }}
                    >
                      {tab}
                    </button>
                  ))}

                  {/* Search icon with dropdown */}
                  <div className="relative" ref={searchRef}>
                    <button
                      onClick={() => setSearchOpen(o => !o)}
                      className="p-2 rounded-full transition-colors"
                      style={{
                        backgroundColor: searchOpen || searchQuery ? '#057642' : pillInactive,
                        color: searchOpen || searchQuery ? '#ffffff' : textMuted,
                        border: `1px solid ${searchOpen || searchQuery ? '#057642' : pillBorder}`,
                      }}
                      title="Search saved posts"
                    >
                      <Search className="w-4 h-4" />
                    </button>

                    {searchOpen && (
                      <div
                        className="absolute left-0 top-11 z-50 rounded-xl shadow-2xl border overflow-hidden"
                        style={{ width: 300, backgroundColor: cardBg, borderColor }}
                      >
                        {/* Input */}
                        <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor }}>
                          <Search className="w-4 h-4 flex-shrink-0" style={{ color: textMuted }} />
                          <input
                            ref={inputRef}
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && commitSearch(searchInput)}
                            placeholder="Search saved posts…"
                            className="flex-1 outline-none text-sm bg-transparent"
                            style={{ color: textPrimary }}
                          />
                          {searchInput && (
                            <button onClick={() => setSearchInput('')} style={{ color: textMuted }}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* History */}
                        {filteredHistory.length > 0 && (
                          <>
                            <div className="flex items-center justify-between px-3 py-1.5" style={{ backgroundColor: isDark ? '#1e2530' : '#f9fafb', borderBottom: `1px solid ${borderColor}` }}>
                              <span className="text-xs font-medium" style={{ color: textMuted }}>Recent searches</span>
                              <button onClick={clearHistory} className="text-xs hover:underline" style={{ color: '#0a66c2' }}>Clear all</button>
                            </div>
                            {filteredHistory.map((h, i) => (
                              <button
                                key={i}
                                onClick={() => commitSearch(h)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors"
                                style={{ color: pillInactiveText, backgroundColor: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: textMuted }} />
                                {h}
                              </button>
                            ))}
                          </>
                        )}

                        {filteredHistory.length === 0 && !searchInput && (
                          <div className="px-3 py-4 text-center text-xs" style={{ color: textMuted }}>No recent searches</div>
                        )}

                        <div className="px-3 py-2 border-t" style={{ borderColor }}>
                          <button
                            onClick={() => commitSearch(searchInput)}
                            className="w-full py-1.5 rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: '#0a66c2' }}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active search tag */}
                  {searchQuery && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: isDark ? 'rgba(10,102,194,0.2)' : '#e8f0fe', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                      <span>"{searchQuery}"</span>
                      <button onClick={clearSearch}><X className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>

                {searchQuery && (
                  <p className="text-xs mt-2" style={{ color: textMuted }}>
                    {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Posts list */}
              <div>
                {filteredPosts.length === 0 ? (
                  <div className="py-12 text-center" style={{ color: textMuted }}>
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No posts match your search.</p>
                    <button onClick={clearSearch} className="mt-2 text-sm hover:underline" style={{ color: '#0a66c2' }}>Clear</button>
                  </div>
                ) : (
                  filteredPosts.map((post, i) => (
                    <div key={post.id} style={{ borderTop: i > 0 ? `1px solid ${borderColor}` : 'none' }}>
                      <SavedPostCard post={post} isDark={isDark} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>

          {/* Right column */}
          <div className="w-[316px] flex-shrink-0 flex flex-col gap-4">
            <StatsPanel posts={savedPosts} isDark={isDark} />
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
