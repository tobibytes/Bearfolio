export type Project = {
  slug: string;
  title: string;
  summary: string;
  owner: string;
  tags: string[];
  cover: string;
  stage: string;
  stats?: string;
};

export const heroStats = [
  { label: 'Portfolios launched', value: '420+' },
  { label: 'Recruiter follows', value: '1.9k' },
  { label: 'Avg. reply time', value: '18h' },
];

export const featureBlocks = [
  {
    title: 'Narrative-first profiles',
    description:
      'Tell the story behind your builds with clean case studies, collaborator notes, and artifacts.',
  },
  {
    title: 'Recruiter-ready feeds',
    description:
      'Curated highlights, crisp tags, and fast filters make it easy to browse student work.',
  },
  {
    title: 'Guided prompts',
    description:
      'Structured templates help students move from raw notes to a polished portfolio in minutes.',
  },
];

export const projects: Project[] = [
  {
    slug: 'transit-pulse',
    title: 'Transit Pulse',
    summary: 'Mapping real-time campus shuttle data with a responsive dashboard and ML-driven ETA predictions.',
    owner: 'Imani Cole',
    tags: ['React', 'Data viz', 'Mapping'],
    cover:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    stage: 'In review',
    stats: '12 handoffs',
  },
  {
    slug: 'civic-signals',
    title: 'Civic Signals',
    summary: 'Crowdsourced maintenance tickets for the city, with mobile-first flows and location clustering.',
    owner: 'Noah Bartee',
    tags: ['Product design', 'Mobile', 'Civic'],
    cover:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
    stage: 'Live beta',
    stats: '8 collaborators',
  },
  {
    slug: 'studio-north',
    title: 'Studio North',
    summary: 'A playful brand kit and microsite template for student-led creative studios.',
    owner: 'Serena Liu',
    tags: ['Brand', 'Web', 'Strategy'],
    cover:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
    stage: 'New',
    stats: '4k views',
  },
  {
    slug: 'borealis-labs',
    title: 'Borealis Labs',
    summary: 'Hardware + software sprint log featuring weekly demos, constraints, and outcomes.',
    owner: 'Malik Green',
    tags: ['Robotics', 'Sprints', 'Research'],
    cover:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    stage: 'In progress',
    stats: '6 artifacts',
  },
  {
    slug: 'north-star-pathways',
    title: 'North Star Pathways',
    summary: 'Mentorship marketplace that pairs freshmen with alumni using interest graphs and open office hours.',
    owner: 'Zuri Prince',
    tags: ['UX', 'Marketplace', 'Education'],
    cover:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    stage: 'Pilot',
    stats: '2 cohorts',
  },
];

export const timeline = [
  {
    title: 'Portfolio sprint',
    detail: 'Drafted two case studies, added outcome metrics, and captured supporting artifacts.',
    when: 'This week',
  },
  {
    title: 'Recruiter follow-up',
    detail: 'Sent Loom walkthrough of Transit Pulse to two partner recruiters.',
    when: 'Yesterday',
  },
  {
    title: 'Collaboration request',
    detail: 'Joined the civic tech studio to ship a design system update.',
    when: '2 days ago',
  },
];

export const focusItems = [
  {
    title: 'Demo kit',
    detail: 'Drop your latest demo link, script, and talking points for showcase day.',
  },
  {
    title: 'Skill tags',
    detail: 'Refresh your top 6 skills so recruiters match you to open roles faster.',
  },
  {
    title: 'Peer review',
    detail: 'Invite a classmate to leave notes on your newest case study.',
  },
];

export const profile = {
  name: 'Jade Collins',
  title: 'Product Designer · Morgan State 2025',
  location: 'Baltimore, MD',
  bio: 'Designing thoughtful tools for students, learning to balance research, systems, and velocity. Obsessed with crisp storytelling and collaborative work.',
  skills: ['Product thinking', 'Storytelling', 'Figma', 'React', 'Design ops', 'Research'],
  highlights: [
    'Led design for Transit Pulse, pairing shuttle data with a responsive dashboard.',
    'Built a reusable case study template to move faster on new projects.',
    'Hosted two recruiting crits with alumni to stress test portfolio messaging.',
  ],
};

export const filters = {
  focus: ['Product', 'Engineering', 'Research', 'Content'],
  timeline: ['Shipping now', 'Recent', 'Archived'],
  format: ['Case study', 'Prototype', 'Research'],
};
