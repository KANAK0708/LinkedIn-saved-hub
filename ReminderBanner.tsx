import { useState } from 'react';
import { Clock, X, ArrowRight } from 'lucide-react';

interface ReminderBannerProps {
  count: number;
  isDark: boolean;
}

export function ReminderBanner({ count, isDark }: ReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-lg px-4 py-3 mb-4 border-l-4"
      style={{
        backgroundColor: isDark ? 'rgba(161,98,7,0.15)' : '#fffbeb',
        borderLeftColor: '#d97706',
        border: `1px solid ${isDark ? 'rgba(217,119,6,0.3)' : '#fde68a'}`,
        borderLeftWidth: 4,
      }}
    >
      <Clock
        className="w-4 h-4 flex-shrink-0 mt-0.5"
        style={{ color: '#d97706' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: isDark ? '#fcd34d' : '#92400e' }}>
          {count} saved post{count !== 1 ? 's' : ''} waiting to be read
        </p>
        <p className="text-xs mt-0.5" style={{ color: isDark ? '#fbbf24' : '#b45309' }}>
          You saved {count === 1 ? 'this' : 'these'} over a week ago — worth revisiting before{' '}
          {count === 1 ? 'it gets' : 'they get'} buried.
        </p>
        <button
          className="flex items-center gap-1 text-xs mt-1.5 font-semibold hover:underline"
          style={{ color: '#d97706' }}
        >
          Review old saves <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1 rounded-full transition-colors"
        style={{ color: isDark ? '#fcd34d' : '#92400e' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
