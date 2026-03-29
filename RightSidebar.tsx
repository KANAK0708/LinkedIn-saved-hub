const jobSearchImage = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=200&fit=crop&crop=faces';

export function RightSidebar() {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {/* Ad Content */}
      <div className="bg-[#004182] text-white p-4">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
            <span className="text-xs font-medium">LinkedIn</span>
          </div>
          <h3 className="text-lg font-semibold leading-tight mb-1">
            Your job search <span className="text-blue-300">powered by</span><br />
            your network
          </h3>
        </div>
        <button className="px-4 py-1.5 bg-white text-[#004182] rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
          Explore Jobs
        </button>
      </div>

      {/* Image */}
      <img
        src={jobSearchImage}
        alt="Job search"
        className="w-full h-auto object-cover"
        style={{ maxHeight: 160 }}
      />

      {/* Ad label */}
      <div className="text-center py-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">Ad</span>
      </div>
    </div>
  );
}
