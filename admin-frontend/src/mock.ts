export type Opportunity = {
  id: string;
  title: string;
  org: string;
  category: string;
  summary: string;
  fields: string[];
  formats: string[];
  status: 'Published' | 'Draft';
  updatedAt: string;
};

export const profile = {
  name: 'Admin User',
  role: 'Opportunity Manager',
  email: 'admin@bearfolio.edu',
};

export const opportunities: Opportunity[] = [
  {
    id: 'o1',
    title: 'Health Equity Fellow',
    org: 'Campus Wellness Lab',
    category: 'Research',
    summary: 'Support a study on nutrition access and student health.',
    fields: ['Health', 'Nutrition'],
    formats: ['Report', 'Deck'],
    status: 'Published',
    updatedAt: '2d ago',
  },
  {
    id: 'o2',
    title: 'Community Art Lead',
    org: 'Arts Council',
    category: 'Art',
    summary: 'Lead a public art walk with student artists.',
    fields: ['Arts', 'Community'],
    formats: ['Gallery', 'Poster'],
    status: 'Draft',
    updatedAt: '1w ago',
  },
  {
    id: 'o3',
    title: 'Transit UX Partner',
    org: 'City Mobility Team',
    category: 'Design',
    summary: 'Co-design shuttle interfaces for students and riders.',
    fields: ['Mobility', 'Product'],
    formats: ['Prototype', 'Deck'],
    status: 'Published',
    updatedAt: '3d ago',
  },
];
