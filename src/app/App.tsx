import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { TopNavbar } from './components/TopNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { SavedPostCard } from './components/SavedPostCard';
import { savedPosts } from './components/savedPostsData';
import { ReminderBanner } from './components/ReminderBanner';
import { StatsPanel } from './components/StatsPanel';
import { MobileHeader } from './components/MobileHeader';

const HISTORY_KEY = 'li_search_history';

export default function App() {
  const [activeTab, setActiveTab] = useState<'All' | 'Articles'>('All');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [postsList, setPostsList] = useState(savedPosts);

  useEffect(() => {
    const loadPosts = () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('scrapedPosts', (result) => {
          if (result.scrapedPosts && Array.isArray(result.scrapedPosts) && result.scrapedPosts.length > 0) {
            const mapped = result.scrapedPosts.map((p: any) => {
              const authorObj = p.author || {};
              return {
                id: p.id || Math.random().toString(),
                author: {
                  name: authorObj.name || p.authorName || 'LinkedIn User',
                  title: authorObj.title || p.authorTitle || '',
                  avatar: authorObj.avatar || p.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
                  followers: authorObj.followers || p.authorFollowers || '',
                },
                content: p.content || '',
                timeAgo: p.timeAgo || 'Recently',
                thumbnailUrl: p.thumbnailUrl || undefined,
                date: p.date ? new Date(p.date) : new Date(),
              };
            });
            setPostsList(mapped);
          }
        });
      }
    };

    loadPosts();

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      const listener = (changes: any, areaName: string) => {
        if (areaName === 'local' && changes.scrapedPosts) {
          loadPosts();
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => {
        chrome.storage.onChanged.removeListener(listener);
      };
    }
  }, []);

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
    let result = postsList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.author.name.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.author.title || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, searchQuery, postsList]);

  // ── Old posts (>7 days) ───────────────────────────────────────────────────
  const oldPostCount = useMemo(() =>
    postsList.filter(p => Date.now() - new Date(p.date).getTime() > 7 * 24 * 60 * 60 * 1000).length
  , [postsList]);

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
    <div className="min-h-screen pb-16 lg:pb-0" style={{ backgroundColor: bg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: textPrimary }}>
      <TopNavbar isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />
      <MobileHeader
        isDark={isDark}
        onToggleDark={() => setIsDark(d => !d)}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onToggleStats={() => setStatsOpen(o => !o)}
      />

      {/* Mobile Search Input Overlay */}
      {searchOpen && (
        <div
          className="px-4 py-2.5 border-b flex lg:hidden items-center gap-2 transition-all sticky top-[52px] z-30"
          style={{ backgroundColor: cardBg, borderColor }}
          ref={searchRef}
        >
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
            <button onClick={() => setSearchInput('')} style={{ color: textMuted }} className="p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => commitSearch(searchInput)}
            className="text-xs font-semibold px-3 py-1 rounded bg-[#0a66c2] text-white hover:bg-[#004182] transition-colors"
          >
            Search
          </button>
        </div>
      )}

      <div className="max-w-[1128px] mx-auto px-0 md:px-4 lg:px-6 py-0 md:py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="order-2 lg:order-1 w-full lg:w-[228px] lg:flex-shrink-0 px-4 md:px-0 mt-4 lg:mt-0">
            <LeftSidebar isDark={isDark} />
          </div>

          <main className="order-1 lg:order-2 flex-1 min-w-0 w-full">
            {/* Reminder Banner */}
            {oldPostCount > 0 && <ReminderBanner count={oldPostCount} isDark={isDark} />}

            <div className="border-0 md:border md:rounded-lg overflow-hidden bg-transparent lg:bg-card" style={{ borderColor }}>
              <div className="px-5 pt-5 pb-3 bg-card" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <h1 className="text-xl font-semibold mb-4 hidden lg:block" style={{ color: textPrimary }}>Saved Posts</h1>

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
          <div className="order-3 lg:order-3 w-full lg:w-[316px] lg:flex-shrink-0 flex flex-col gap-4 px-4 md:px-0">
            <StatsPanel posts={postsList} isDark={isDark} />
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation for Mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t flex lg:hidden items-stretch justify-around h-[52px] transition-colors"
        style={{
          backgroundColor: isDark ? '#1e2530' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
        }}
      >
        <a href="#" className="flex flex-col items-center justify-center flex-1 py-1 border-b-2 border-gray-900 relative" style={{ color: isDark ? '#ffffff' : '#000000' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.54 8.61L12.38 1.12a.65.65 0 00-.76 0L1.46 8.61A.68.68 0 001.1 9.2v12.27a.68.68 0 00.68.68h7.32v-7.48h5.8v7.48h7.32a.68.68 0 00.68-.68V9.2a.68.68 0 00-.36-.59z"/>
          </svg>
          <span className="text-[9px] mt-0.5 font-medium">Home</span>
        </a>

        <a href="#" className="flex flex-col items-center justify-center flex-1 py-1 relative" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          <div className="relative">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">2</span>
          </div>
          <span className="text-[9px] mt-0.5">My Network</span>
        </a>

        <a href="#" className="flex flex-col items-center justify-center flex-1 py-1" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4l2 .5V19a1 1 0 001 1h14a1 1 0 001-1v-8.5l2-.5V6h-5zm-8-1a1 1 0 011-1h4a1 1 0 011 1v1H9V5zm9 13H6v-7.9l6 1.4 6-1.4V18z"/>
          </svg>
          <span className="text-[9px] mt-0.5">Jobs</span>
        </a>

        <a href="#" className="flex flex-col items-center justify-center flex-1 py-1" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 4H8C4.7 4 2 6.7 2 10s2.7 6 6 6v4l4-4h4c3.3 0 6-2.7 6-6S19.3 4 16 4z"/>
          </svg>
          <span className="text-[9px] mt-0.5">Messaging</span>
        </a>

        <a href="#" className="flex flex-col items-center justify-center flex-1 py-1" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 19h-6.18C15.4 20.21 13.8 21 12 21s-3.4-.79-3.82-2H2v-1l2-1V10c0-3.35 2.29-6.16 5.5-6.83V3a2.5 2.5 0 015 0v.17C17.71 3.84 20 6.65 20 10v7l2 1v1zM12 4a5 5 0 00-5 5v7h10V9a5 5 0 00-5-5zm0 16a1 1 0 001-1h-2a1 1 0 001 1z"/>
          </svg>
          <span className="text-[9px] mt-0.5">Notifications</span>
        </a>
      </nav>

      {/* Stats Panel Drawer for Mobile */}
      {statsOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setStatsOpen(false)}
          />
          {/* Drawer Content */}
          <div
            className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl shadow-2xl p-4 border-t transition-all flex flex-col gap-4 animate-slide-up"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            {/* Handle bar */}
            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" onClick={() => setStatsOpen(false)} />
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor }}>
              <h2 className="text-lg font-bold" style={{ color: textPrimary }}>Save Statistics</h2>
              <button
                onClick={() => setStatsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ color: textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <StatsPanel posts={postsList} isDark={isDark} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
