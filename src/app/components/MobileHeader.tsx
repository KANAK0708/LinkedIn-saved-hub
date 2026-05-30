import { ArrowLeft, Search, BarChart2, Sun, Moon } from 'lucide-react';

interface MobileHeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onToggleStats: () => void;
}

export function MobileHeader({
  isDark,
  onToggleDark,
  searchOpen,
  setSearchOpen,
  onToggleStats,
}: MobileHeaderProps) {
  const bg = isDark ? '#1e2530' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = isDark ? '#ffffff' : '#000000';
  const iconColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)';

  return (
    <header
      className="sticky top-0 z-40 border-b lg:hidden h-[52px] flex items-center justify-between px-4 transition-colors"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      {/* Left: Back arrow + Title */}
      <div className="flex items-center gap-4">
        <button
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: text }}
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-semibold" style={{ color: text }}>
          Saved Posts and Articles
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search Toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: searchOpen ? '#057642' : iconColor }}
          title="Search saves"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Stats Toggle */}
        <button
          onClick={onToggleStats}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: iconColor }}
          title="View save statistics"
        >
          <BarChart2 className="w-5 h-5" />
        </button>

        {/* Dark Mode */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: iconColor }}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
