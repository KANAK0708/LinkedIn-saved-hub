import { useState, useMemo } from 'react';
import type { SavedPostItem } from './savedPostsData';

interface StatsPanelProps {
  posts: SavedPostItem[];
  isDark: boolean;
}

type Range = 'Today' | 'This week' | 'This month';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDayIndex(date: Date) {
  const d = date.getDay();
  return d === 0 ? 6 : d - 1; // Mon=0 ... Sun=6
}

function startOf(range: Range): Date {
  const now = new Date();
  if (range === 'Today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (range === 'This week') {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  // This month
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function StatsPanel({ posts, isDark }: StatsPanelProps) {
  const [range, setRange] = useState<Range>('This week');

  const filtered = useMemo(() => {
    const start = startOf(range);
    return posts.filter(p => new Date(p.date) >= start);
  }, [posts, range]);

  const total = posts.length;
  const oldest = posts.length > 0
    ? new Date(Math.min(...posts.map(p => new Date(p.date).getTime())))
    : null;

  // Day-of-week bar counts (always use all posts for the bar chart)
  const dayCounts = useMemo(() => {
    const counts = Array(7).fill(0);
    posts.forEach(p => { counts[getDayIndex(new Date(p.date))]++; });
    return counts;
  }, [posts]);
  const maxDay = Math.max(...dayCounts, 1);

  const cardBg = isDark ? '#242a31' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const textPrimary = isDark ? '#e7e7e7' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const statCardBg = isDark ? '#1e2530' : '#f9fafb';
  const rangeActive = '#0a66c2';
  const rangeInactive = isDark ? '#2c3340' : '#f3f4f6';
  const rangeActiveText = '#ffffff';
  const rangeInactiveText = isDark ? '#d1d5db' : '#374151';

  const olddestLabel = oldest
    ? oldest.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: cardBg, borderColor }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold mb-3" style={{ color: textPrimary }}>Your Saves</h3>

        {/* Range filters */}
        <div className="flex gap-1.5">
          {(['Today', 'This week', 'This month'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: range === r ? rangeActive : rangeInactive,
                color: range === r ? rangeActiveText : rangeInactiveText,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ backgroundColor: statCardBg }}>
          <div className="text-2xl font-bold" style={{ color: textPrimary }}>{total}</div>
          <div className="text-xs mt-0.5" style={{ color: textMuted }}>Total Saved</div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: statCardBg }}>
          <div className="text-2xl font-bold" style={{ color: textPrimary }}>{filtered.length}</div>
          <div className="text-xs mt-0.5" style={{ color: textMuted }}>
            {range === 'Today' ? 'Today' : range === 'This week' ? 'This Week' : 'This Month'}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: statCardBg }}>
          <div className="text-2xl font-bold" style={{ color: textPrimary }}>{total}</div>
          <div className="text-xs mt-0.5" style={{ color: textMuted }}>Read</div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: statCardBg }}>
          <div className="text-sm font-semibold leading-tight" style={{ color: textPrimary }}>{olddestLabel}</div>
          <div className="text-xs mt-0.5" style={{ color: textMuted }}>Oldest Save</div>
        </div>
      </div>

      {/* Day of week bar chart */}
      <div className="px-4 pb-4">
        <p className="text-xs mb-2" style={{ color: textMuted }}>Saves by day of week</p>
        <div className="flex items-end gap-1 h-10">
          {dayCounts.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: count === 0 ? 3 : Math.max(4, (count / maxDay) * 32),
                  backgroundColor: count === 0 ? (isDark ? '#374151' : '#e5e7eb') : '#0a66c2',
                }}
                title={`${DAYS[i]}: ${count}`}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {DAYS.map(d => (
            <div key={d} className="flex-1 text-center text-[9px]" style={{ color: textMuted }}>{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
