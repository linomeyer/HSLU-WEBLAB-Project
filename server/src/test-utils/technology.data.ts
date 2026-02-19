export const testTechnologies = [
  {
    name: 'React',
    category: 'Languages & Frameworks',
    ring: 'Adopt',
    description: 'A JavaScript library for building user interfaces',
    reason:
      'React provides excellent performance and a component-based architecture that scales well for large applications.',
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    changedAt: new Date('2024-01-15'),
  },
  {
    name: 'Angular',
    category: 'Languages & Frameworks',
    ring: 'Trial',
    description: 'A TypeScript-based web application framework',
    reason:
      'Angular offers a complete solution with built-in features, but has a steeper learning curve than alternatives.',
    isPublished: true,
    createdAt: new Date('2024-01-20'),
    changedAt: new Date('2024-01-20'),
  },
  {
    name: 'Docker',
    category: 'Platforms',
    ring: 'Adopt',
    description: 'Container platform',
    reason:
      'Docker has become the industry standard for containerization, providing consistent environments across development and production.',
    isPublished: true,
    createdAt: new Date('2024-01-10'),
    changedAt: new Date('2024-01-10'),
  },
  {
    name: 'Kubernetes',
    category: 'Platforms',
    ring: 'Assess',
    description: 'Container orchestration',
    reason:
      'Kubernetes is powerful but complex. We are assessing whether the operational overhead is justified for our use cases.',
    isPublished: false,
    createdAt: new Date('2024-01-05'),
    changedAt: new Date('2024-01-05'),
  },
  {
    name: 'GraphQL',
    category: 'Tools',
    ring: 'Trial',
    description: 'Query language for APIs',
    reason:
      'GraphQL offers flexible data fetching, but requires careful schema design and adds complexity to the backend.',
    isPublished: true,
    createdAt: new Date('2024-01-12'),
    changedAt: new Date('2024-01-12'),
  },
  {
    name: 'Microservices',
    category: 'Techniques',
    ring: 'Adopt',
    description: 'Architectural style',
    reason:
      'Microservices architecture enables independent deployment and scaling, improving our system resilience and team autonomy.',
    isPublished: true,
    createdAt: new Date('2024-01-08'),
    changedAt: new Date('2024-01-08'),
  },
];

export const singleTechnology = {
  name: 'Vue.js',
  category: 'Languages & Frameworks',
  ring: 'Hold',
  description: 'Progressive JavaScript framework',
  reason:
    'While Vue.js is a good framework, we are standardizing on React to reduce technology fragmentation in our stack.',
  isPublished: false,
  createdAt: new Date('2024-02-01'),
  changedAt: new Date('2024-02-01'),
};
