import { AppItem } from '../types';

export const APPS: AppItem[] = [
  {
    id: 'voxcadd',
    name: 'VoxCADD',
    desc: 'Browser-based CAD drafting and design workspace.',
    url: 'https://vox-cadd.vercel.app/',
    live: true,
    logo: '/voxcadd-logo.png',
    bg: 'linear-gradient(135deg,#0b1020,#10304a)'
  },
  {
    id: 'archpad',
    name: 'Arch Pad Pro',
    desc: 'A digital sketch pad for architectural ideas.',
    url: 'https://arch-pad-pro.vercel.app/',
    live: true,
    bg: 'linear-gradient(135deg,#5b8cff,#3a5bd9)',
    icon: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z'
  },
  {
    id: 'tento7',
    name: '10to7',
    desc: 'Your productivity and work management application.',
    url: 'https://10-to-7.vercel.app/',
    live: true,
    bg: 'linear-gradient(135deg,#8b5cff,#5b3fd1)',
    icon: 'M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18 M8 15h3'
  },
  {
    id: 'interiorbot',
    name: 'Interior Bot',
    desc: 'AI interior design application. Integration will follow after troubleshooting.',
    live: false,
    bg: 'linear-gradient(135deg,#3a4468,#262e4d)',
    icon: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z'
  }
];

export const VERSION_HISTORY = [
  {
    version: '1.2.0',
    date: 'October 2026',
    changes: [
      'Admin Console: stop or resume individual services.',
      'Stopped services show a clear status and message.',
      'New Vox Ecosystem logo.'
    ]
  },
  {
    version: '1.1.0',
    date: 'October 2026',
    changes: [
      'Redesigned, professional interface with bottom navigation.',
      'Installable app with offline support.',
      'App search and live status labels.',
      'New Info section: About, Version History, Privacy Policy and Terms of Use.'
    ]
  },
  {
    version: '1.0.0',
    date: 'Initial release',
    changes: [
      'Launcher for VoxCADD, Arch Pad Pro and 10to7.',
      'Interior Bot placeholder.'
    ]
  }
];
