export interface SavedPostItem {
  id: string;
  author: {
    name: string;
    title?: string;
    avatar: string;
    followers?: string;
  };
  content: string;
  timeAgo: string;
  thumbnailUrl?: string;
  date: Date;
}

export const savedPosts: SavedPostItem[] = [
  {
    id: '1',
    author: {
      name: 'Vidyatta',
      title: '',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
      followers: '3K followers',
    },
    content: 'Are you truly ready to master Python, or are you just scratching the surface?',
    timeAgo: '3w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=120&h=120&fit=crop',
    date: new Date('2026-01-22'),
  },
  {
    id: '2',
    author: {
      name: 'Shubham Wadekar',
      title: '290K @LinkedIn | Data Engineer | Software Developer | Data Science Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      followers: '290K followers',
    },
    content: "You won't master SQL in a month.\nYou won't master Python in a month.\nYou won't master Pyspark in a month...",
    timeAgo: '3rd+',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=120&fit=crop',
    date: new Date('2026-02-09'),
  },
  {
    id: '3',
    author: {
      name: 'Chandra Sekhar',
      title: 'Senior Data Engineer | Azure Data Engineer | 3x Azure Certified',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      followers: '145K followers',
    },
    content: "Breaking down complex data pipelines into simple, understandable components. Here's what I learned building scalable ETL systems at enterprise scale.",
    timeAgo: '3rd+',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
    date: new Date('2026-02-09'),
  },
  {
    id: '4',
    author: {
      name: 'Sarah Chen',
      title: 'Product Manager at Google | Ex-Microsoft | Stanford MBA',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      followers: '87K followers',
    },
    content: 'The future of AI in product development: A comprehensive guide covering everything from ideation to implementation. Sharing real-world case studies from leading tech companies and the lessons we learned along the way.',
    timeAgo: '2d',
    date: new Date('2026-02-10'),
  },
  {
    id: '5',
    author: {
      name: 'Marcus Johnson',
      title: 'UX Designer at Meta | Design Systems | Accessibility Advocate',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      followers: '52K followers',
    },
    content: "Just wrapped up an amazing design sprint with the team. Here's a sneak peek at what we've been working on. The future of social connection is looking bright! Our approach to inclusive design has completely transformed the user experience.",
    timeAgo: '5h',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&h=120&fit=crop',
    date: new Date('2026-02-12'),
  },
  {
    id: '6',
    author: {
      name: 'Emily Rodriguez',
      title: 'Tech Lead at Amazon Web Services | Cloud Architecture',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      followers: '134K followers',
    },
    content: 'Managing distributed engineering teams in 2026: Best practices for async communication, maintaining team culture across time zones, and driving productivity in a remote-first world.',
    timeAgo: '1d',
    date: new Date('2026-02-11'),
  },
  {
    id: '7',
    author: {
      name: 'David Park',
      title: 'CEO at TechStartup | Y Combinator S23 | Angel Investor',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop',
      followers: '98K followers',
    },
    content: "Honored to speak at TechConf 2026! My keynote on building sustainable startups in the age of AI. Thank you to everyone who attended and shared your insights. The conversations afterward were incredible.",
    timeAgo: '3d',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&h=120&fit=crop',
    date: new Date('2026-02-09'),
  },
  {
    id: '8',
    author: {
      name: 'Lisa Anderson',
      title: 'Engineering Manager at Microsoft | Azure | Cloud Native',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      followers: '76K followers',
    },
    content: "How to scale your SaaS business from $1M to $10M ARR: A practical guide with frameworks, metrics, and hard-earned lessons from 50+ successful companies. Download the free playbook in the comments.",
    timeAgo: '4d',
    date: new Date('2026-02-08'),
  },
];
