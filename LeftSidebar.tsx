import { Bookmark } from 'lucide-react';

interface LeftSidebarProps {
  isDark: boolean;
}

export function LeftSidebar({ isDark }: LeftSidebarProps) {
  const cardBg = isDark ? '#242a31' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const textPrimary = isDark ? '#e7e7e7' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  const activeBg = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6';
  const activeBorder = isDark ? '#e7e7e7' : '#111827';

  return (
    <aside className="w-[228px] flex-shrink-0">
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: cardBg, borderColor }}>
        {/* Header */}
        <div className="p-3 border-b flex items-center gap-2" style={{ borderColor }}>
          <Bookmark className="w-4 h-4" style={{ color: textMuted }} />
          <span className="text-sm font-semibold" style={{ color: textPrimary }}>My items</span>
        </div>

        {/* Menu */}
        <nav>
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2.5 text-sm transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = hoverBg; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span>My jobs</span>
            <span style={{ color: textMuted }}>14</span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold border-l-2"
            style={{ backgroundColor: activeBg, borderLeftColor: activeBorder, color: textPrimary }}
          >
            <span>Saved posts and articles</span>
            <span style={{ color: textMuted }}>10+</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}
