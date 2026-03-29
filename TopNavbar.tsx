import { Moon, Sun } from 'lucide-react';

interface TopNavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function TopNavbar({ isDark, onToggleDark }: TopNavbarProps) {
  const navBg = isDark ? '#1e2530' : '#ffffff';
  const navBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const navText = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const navTextHover = isDark ? '#ffffff' : '#000000';
  const searchBg = isDark ? '#2c3340' : '#EEF3F8';
  const searchText = isDark ? '#e7e7e7' : '#000000';

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: navBg, borderColor: navBorder }}
    >
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="flex items-center justify-between h-[52px]">

          {/* Left: Logo + Search */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-[34px] h-[34px] rounded flex-shrink-0" style={{ backgroundColor: '#0A66C2' }}>
              <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </div>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="w-[220px] pl-8 pr-3 py-1.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                style={{ backgroundColor: searchBg, color: searchText }}
              />
            </div>
          </div>

          {/* Right: Nav items */}
          <nav className="flex items-stretch h-full">
            {/* Home — active with underline */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[68px] border-b-2 border-gray-900 relative" style={{ color: isDark ? '#ffffff' : '#000000' }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 8.61L12.38 1.12a.65.65 0 00-.76 0L1.46 8.61A.68.68 0 001.1 9.2v12.27a.68.68 0 00.68.68h7.32v-7.48h5.8v7.48h7.32a.68.68 0 00.68-.68V9.2a.68.68 0 00-.36-.59z"/>
              </svg>
              <span className="text-[10px] mt-0.5 font-medium">Home</span>
            </a>

            {/* My Network */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[68px] hover:text-black transition-colors relative" style={{ color: navText }}>
              <div className="relative">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" opacity="0" />
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
              </div>
              <span className="text-[10px] mt-0.5">My Network</span>
            </a>

            {/* Jobs */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[56px] hover:text-black transition-colors" style={{ color: navText }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4l2 .5V19a1 1 0 001 1h14a1 1 0 001-1v-8.5l2-.5V6h-5zm-8-1a1 1 0 011-1h4a1 1 0 011 1v1H9V5zm9 13H6v-7.9l6 1.4 6-1.4V18z"/>
              </svg>
              <span className="text-[10px] mt-0.5">Jobs</span>
            </a>

            {/* Messaging */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[68px] hover:text-black transition-colors" style={{ color: navText }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4H8C4.7 4 2 6.7 2 10s2.7 6 6 6v4l4-4h4c3.3 0 6-2.7 6-6S19.3 4 16 4z"/>
              </svg>
              <span className="text-[10px] mt-0.5">Messaging</span>
            </a>

            {/* Notifications */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[76px] hover:text-black transition-colors" style={{ color: navText }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 19h-6.18C15.4 20.21 13.8 21 12 21s-3.4-.79-3.82-2H2v-1l2-1V10c0-3.35 2.29-6.16 5.5-6.83V3a2.5 2.5 0 015 0v.17C17.71 3.84 20 6.65 20 10v7l2 1v1zM12 4a5 5 0 00-5 5v7h10V9a5 5 0 00-5-5zm0 16a1 1 0 001-1h-2a1 1 0 001 1z"/>
              </svg>
              <span className="text-[10px] mt-0.5">Notifications</span>
            </a>

            {/* Me */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[52px] border-r hover:text-black transition-colors" style={{ color: navText, borderColor: navBorder }}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop"
                alt="Me"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] mt-0.5">Me</span>
                <svg className="w-2.5 h-2.5 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </a>

            {/* For Business */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[72px] hover:text-black transition-colors" style={{ color: navText }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4zM3 10h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4zM3 17h4v4H3zm7 0h4v4h-4zm7 0h4v4h-4z"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">For Business</span>
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </a>

            {/* Learning */}
            <a href="#" className="flex flex-col items-center justify-center px-3 min-w-[60px] hover:text-black transition-colors border-r" style={{ color: navText, borderColor: navBorder }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              <span className="text-[10px] mt-0.5">Learning</span>
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="flex flex-col items-center justify-center px-3 transition-colors"
              style={{ color: navText }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun className="w-5 h-5" />
                : <Moon className="w-5 h-5" />}
              <span className="text-[10px] mt-0.5">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Try Premium */}
            <a href="#" className="flex items-center px-3 hover:bg-orange-50 rounded transition-colors" style={{ color: '#915907' }}>
              <span className="text-xs font-medium underline whitespace-nowrap">Try Premium for ₹0</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
