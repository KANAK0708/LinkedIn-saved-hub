import { useState, useRef, useEffect, useMemo } from 'react';
import { MoreHorizontal, Globe, Download, X, BookmarkX, ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cardBg = isDark ? '#242a31' : '#ffffff';
  const textPrimary = isDark ? '#e7e7e7' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const textSecondary = isDark ? '#d1d5db' : '#374151';
  const menuBg = isDark ? '#2c3340' : '#ffffff';
  const menuBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const menuHover = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';

  // Format connection and timeAgo dynamically
  const displayTime = useMemo(() => {
    return post.timeAgo.includes('rd+') ? '3w' : post.timeAgo;
  }, [post.timeAgo]);

  const connection = useMemo(() => {
    return post.timeAgo.includes('rd+') ? '3rd+' : '2nd';
  }, [post.timeAgo]);

  // Generate dynamic reaction counts based on post ID
  const stats = useMemo(() => {
    const seed = parseInt(post.id) || 1;
    const likes = (seed * 127 + 23) % 850 + 20; // Some realistic counts
    const comments = (seed * 17 + 3) % 45 + 5;
    return { likes, comments };
  }, [post.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (removed) return null;

  return (
    <>
      {/* DESKTOP VIEW: INDENTED TWO-COLUMN VIEW */}
      <div
        className="hidden lg:block p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ backgroundColor: cardBg }}
      >
        <div className="flex gap-3">
          {/* Left: Avatar + small thumbnail */}
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
                  className="p-1.5 rounded-full transition-colors cursor-pointer"
                  style={{ color: textMuted, backgroundColor: menuOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6') : 'transparent' }}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-8 z-30 rounded-lg shadow-xl border overflow-hidden"
                    style={{ width: 200, backgroundColor: menuBg, borderColor: menuBorder }}
                  >
                    <button
                      onClick={() => { exportPostPDF(post); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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
              <p className="text-sm leading-5 whitespace-pre-line" style={{ color: textPrimary }}>
                {post.content.length > 180 && !isExpanded
                  ? post.content.substring(0, 180) + '...'
                  : post.content}
              </p>
              {post.content.length > 180 && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs font-semibold mt-1 cursor-pointer hover:underline"
                  style={{ color: textMuted }}
                >
                  see more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: SCREENSHOT-ALIGNED CARD LAYOUT */}
      <div
        className="block lg:hidden p-4 mb-2 border-b border-t transition-colors flex flex-col gap-3"
        style={{ backgroundColor: cardBg, borderColor: menuBorder }}
      >
        {/* 1. Header (Horizontal flex) */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm hover:underline cursor-pointer leading-tight" style={{ color: isDark ? '#93c5fd' : '#0A66C2' }}>
                  {post.author.name}
                </span>
                <span className="text-xs" style={{ color: textMuted }}>• {connection}</span>
              </div>
              {post.author.title && (
                <p className="text-xs leading-snug line-clamp-1 mt-0.5" style={{ color: textMuted }} title={post.author.title}>
                  {post.author.title}
                </p>
              )}
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px]" style={{ color: textMuted }}>{displayTime}</span>
                <span className="text-[11px]" style={{ color: textMuted }}>•</span>
                <Globe className="w-3 h-3" style={{ color: textMuted }} />
              </div>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative ml-2 flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-full transition-colors cursor-pointer"
              style={{ color: textMuted, backgroundColor: menuOpen ? (isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6') : 'transparent' }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-30 rounded-lg shadow-xl border overflow-hidden"
                style={{ width: 200, backgroundColor: menuBg, borderColor: menuBorder }}
              >
                <button
                  onClick={() => { exportPostPDF(post); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer"
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

        {/* 2. Post Content (Full Width) */}
        <div className="mt-1">
          <p className="text-[13px] md:text-sm leading-relaxed whitespace-pre-line" style={{ color: textPrimary }}>
            {post.content.length > 180 && !isExpanded
              ? post.content.substring(0, 180) + '...'
              : post.content}
            {post.content.length > 180 && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs md:text-sm font-semibold ml-1 cursor-pointer hover:underline"
                style={{ color: textMuted }}
              >
                see more
              </button>
            )}
          </p>
        </div>

        {/* 3. Media Embed (Full Width Image) */}
        {post.thumbnailUrl && (
          <div className="mx-[-16px] border-t border-b cursor-pointer overflow-hidden max-h-[340px]" style={{ borderColor: menuBorder }}>
            <img
              src={post.thumbnailUrl}
              alt="Post preview"
              className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        )}

        {/* 4. Social Metrics Bar */}
        <div className="flex items-center justify-between px-1 py-1.5 text-xs border-b transition-colors" style={{ color: textMuted, borderColor: menuBorder }}>
          <div className="flex items-center gap-1">
            {/* Mock Reaction Icons */}
            <div className="flex items-center -space-x-1">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">👍</span>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px]">❤️</span>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 text-white text-[9px]">💡</span>
            </div>
            <span>{stats.likes + (liked ? 1 : 0)}</span>
          </div>
          <span className="hover:underline cursor-pointer">{stats.comments} comments</span>
        </div>

        {/* 5. Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setLiked(!liked)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs md:text-[13px] font-semibold rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            style={{ color: liked ? '#0a66c2' : textMuted }}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-[#0a66c2]' : ''}`} />
            <span>Like</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs md:text-[13px] font-semibold rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" style={{ color: textMuted }}>
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs md:text-[13px] font-semibold rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" style={{ color: textMuted }}>
            <Repeat2 className="w-4 h-4" />
            <span>Repost</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs md:text-[13px] font-semibold rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" style={{ color: textMuted }}>
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </>
  );
}
