import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Globe, Download, X, BookmarkX } from 'lucide-react';
import type { SavedPostItem } from './savedPostsData';

interface SavedPostCardProps {
  post: SavedPostItem;
  isDark: boolean;
}

function exportPostPDF(post: SavedPostItem) {
  // Dynamically import jspdf to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Header bar
    doc.setFillColor(10, 102, 194);
    doc.rect(0, 0, pageW, 14, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('LinkedIn — Saved Post', margin, 9);
    doc.text(`Exported ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW - margin, 9, { align: 'right' });

    y = 30;

    // Author
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(post.author.name, margin, y);
    y += 8;

    if (post.author.title) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      const titleLines = doc.splitTextToSize(post.author.title, pageW - 2 * margin);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 5 + 3;
    }

    // Meta
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const savedDate = new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`Saved: ${savedDate}  ·  ${post.timeAgo}  ·  Public`, margin, y);
    y += 10;

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageW - margin, y);
    y += 10;

    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    const contentLines = doc.splitTextToSize(post.content, pageW - 2 * margin);
    doc.text(contentLines, margin, y);
    y += contentLines.length * 6 + 10;

    // Followers
    if (post.author.followers) {
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text(`${post.author.followers}`, margin, y);
    }

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Generated from LinkedIn Saved Posts', margin, pageH - 10);

    const safeName = post.author.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`linkedin_post_${safeName}.pdf`);
  });
}

export function SavedPostCard({ post, isDark }: SavedPostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [removed, setRemoved] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cardBg = isDark ? '#242a31' : '#ffffff';
  const textPrimary = isDark ? '#e7e7e7' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const textSecondary = isDark ? '#d1d5db' : '#374151';
  const menuBg = isDark ? '#2c3340' : '#ffffff';
  const menuBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const menuHover = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (removed) return null;

  return (
    <div className="p-4 transition-colors" style={{ backgroundColor: cardBg }}>
      <div className="flex gap-3">
        {/* Avatar + thumbnail */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
          {post.thumbnailUrl && (
            <img src={post.thumbnailUrl} alt="preview" className="w-14 h-14 object-cover rounded border" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm hover:underline cursor-pointer" style={{ color: isDark ? '#93c5fd' : '#0A66C2' }}>
                {post.author.name}
              </h3>
              {post.author.followers && (
                <p className="text-xs" style={{ color: textMuted }}>{post.author.followers}</p>
              )}
              {post.author.title && (
                <p className="text-xs truncate" style={{ color: textMuted }}>{post.author.title}</p>
              )}
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs" style={{ color: textMuted }}>{post.timeAgo}</span>
                <span style={{ color: textMuted }}>•</span>
                <Globe className="w-3 h-3" style={{ color: textMuted }} />
              </div>
            </div>

            {/* 3-dot menu */}
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="p-1.5 rounded-full transition-colors"
                style={{ color: textMuted, backgroundColor: menuOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6') : 'transparent' }}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-8 z-50 rounded-lg shadow-xl border overflow-hidden"
                  style={{ width: 200, backgroundColor: menuBg, borderColor: menuBorder }}
                >
                  <button
                    onClick={() => { exportPostPDF(post); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors"
                    style={{ color: textSecondary }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = menuHover; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <Download className="w-4 h-4 flex-shrink-0" style={{ color: '#0a66c2' }} />
                    Export this post as PDF
                  </button>
                  <div style={{ height: 1, backgroundColor: menuBorder }} />
                  <button
                    onClick={() => { setRemoved(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors"
                    style={{ color: '#dc2626' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = menuHover; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <BookmarkX className="w-4 h-4 flex-shrink-0" />
                    Unsave post
                  </button>
                  <div style={{ height: 1, backgroundColor: menuBorder }} />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors"
                    style={{ color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = menuHover; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <X className="w-4 h-4 flex-shrink-0" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post text */}
          <div className="mt-1">
            <p className="text-sm leading-5" style={{ color: textPrimary }}>
              {post.content.length > 180
                ? post.content.substring(0, 180) + '...'
                : post.content}
            </p>
            {post.content.length > 180 && (
              <button className="text-sm mt-0.5 font-medium" style={{ color: textMuted }}>
                ...see more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
