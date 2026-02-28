export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description?: string;
  responsibilities: string[];
  recognition?: { title: string; date: string; description: string };
  projects?: {
    name: string;
    tech: string;
    points: string[];
  }[];
}

export interface Project {
  title: string;
  period?: string;
  role: string;
  description: string;
  techStack: string[];
  features: string[];
  links: { label: string; url: string }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface Certification {
  title: string;
  url: string;
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
  colorClass: string;
}

export const RESUME_DATA = {
  metrics: [
    { value: 4, suffix: '+', label: 'Years Exp.', colorClass: 'text-teal-400' },
    { value: 15, suffix: '+', label: 'Projects', colorClass: 'text-purple-400' },
    { value: 100, suffix: '%', label: 'Full-Stack', colorClass: 'text-indigo-400' },
    { value: 24, suffix: '/7', label: 'Coffee', colorClass: 'text-amber-400' }
  ] as Metric[],
  personal: {
    name: 'Rajnish Kumar',
    title: 'Senior Software Engineer | Architecting High-Performance Web Applications',
    email: 'code.rajnishkumar@gmail.com',
    phone: '8709050669',
    linkedin: 'linkedin.com/in/rajnish-kumar-8709050669-',
    github: 'github.com/RajnishKumar07',
    summary: `Senior Software Engineer with 4+ years of hands-on experience designing and scaling enterprise-grade web applications. Expertise in the Angular ecosystem (v14-20), TypeScript, and reactive programming with RxJS. 

Currently spearheading frontend modernization efforts at Encora Inc., migrating legacy enterprise platforms to Angular 20. Backed by solid full-stack capabilities with NestJS and MySQL, I thrive in architecting modular components, optimizing rendering performance, and driving technical excellence across cross-functional engineering teams.`
  },
  skills: [
    {
      category: 'Frontend & UI',
      iconUrl: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      colorClass: 'purple',
      items: ['Angular (14–20)', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS', 'Angular Material', 'CDK', 'HTML5/CSS3']
    },
    {
      category: 'Real-time & Backend',
      iconUrl: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      colorClass: 'teal',
      items: ['Node.js', 'NestJS', 'Express', 'MySQL', 'TypeORM', 'WebRTC', 'Socket.io', 'JWT']
    },
    {
      category: 'Tools & DevOps',
      iconUrl: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z|M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      colorClass: 'indigo',
      items: ['Nx Workspace', 'Git', 'Docker', 'GitHub Actions', 'CI/CD', 'Swagger', 'Agile/Scrum', 'Figma']
    }
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Encora Inc.',
      period: 'October 2025 – Present',
      location: 'Pune, Maharashtra',
      description: 'Enterprise Service Management Platform:\nLeading the UI architecture modernization for a massive legacy automotive service workflow application.',
      responsibilities: [
        'Architecting scalable, lazy-loaded Angular 20 modules for customer management and telemetry tracking.',
        'Collaborating within a 40+ member cross-functional team to establish unified frontend coding standards.',
        'Mentoring junior engineers, conducting rigorous architectural PR reviews, and shaping implementation strategies.',
        'Refactoring massive monolithic components into highly reusable, granular UI libraries.'
      ],
      recognition: {
        title: 'The Genesis Award',
        date: 'February 2026',
        description: 'Awarded for exceptional rapid growth, unparalleled ownership, and technical leadership during critical modernization phases.'
      }
    },
    {
      role: 'Software Engineer (Angular)',
      company: 'Hidden Brains InfoTech Pvt. Ltd.',
      period: 'July 2022 – September 2025',
      location: 'Ahmedabad, Gujarat',
      projects: [
        {
          name: 'Expert-Guest Video Calling Platform',
          tech: 'Angular 19, WebRTC, Socket.io, Canvas API, Nx',
          points: [
            'Engineered multi-user peer-to-peer web video infrastructure with real-time AI summary integration.',
            'Developed a synchronized canvas annotation layer utilizing WebSockets with <15ms latency.',
            'Optimized data streams, improving overall application performance over low-bandwidth networks by 25%.'
          ]
        },
        {
          name: 'Enterprise Boardroom with AI',
          tech: 'Angular 17, Angular Material, RxJS',
          points: [
            'Built a highly reactive, dynamic form engine handling 100+ nested validation streams seamlessly.'
          ]
        },
        {
          name: 'Dynamic Resume Builder',
          tech: 'Angular 16, CDK, RxJS',
          points: [
            'Created a complex drag-and-drop WYSIWYG interface with continuous auto-save debouncing.'
          ]
        }
      ],
      responsibilities: [
        'Led end-to-end frontend development lifecycles for multiple high-profile enterprise applications.',
        'Established CI/CD pipelines for staging environments, reducing deployment friction.',
        'Collaborated directly with backend architects to design decoupled, RESTful API contracts.'
      ]
    },
    {
      role: 'Vocational Trainee',
      company: 'Hidden Brains InfoTech Pvt. Ltd.',
      period: 'January 2022 – June 2022',
      location: 'Ahmedabad, Gujarat',
      responsibilities: [
        'Completed an intensive 6-month full-stack bootcamp focusing on Angular, Node.js, and SQL design patterns.',
        'Successfully transitioned to a full-time engineering role after delivering production-ready internal tools.'
      ]
    }
  ] as Experience[],
  projects: [
    {
      title: 'Enterprise E-Commerce API',
      period: 'Jan 2025 – Apr 2025',
      role: 'Backend Architect',
      description: 'Completely overhauled a legacy Node.js/MongoDB backend infrastructure into a robust, strongly-typed NestJS application. This project demonstrates my ability to pivot to the backend to enforce modular architecture, relational data integrity, and modern CI/CD practices.',
      techStack: ['NestJS', 'TypeScript', 'MySQL', 'TypeORM', 'Docker', 'GitHub Actions'],
      features: [
        'Modular, hexagonal architecture implementing strict dependency injection.',
        'Complex relational schema migrations from MongoDB to MySQL using TypeORM.',
        'Secure JWT cookie-based Auth with scalable Role-Based Access Control (RBAC).',
        'Stripe payment gateway integration with robust webhook signature verification.',
        'Containerized deployment workflows mapping directly to automated GitHub Actions.'
      ],
      links: [
        { label: 'Live Application API', url: 'https://app-verse.onrender.com/products' },
        { label: 'Swagger API Docs', url: 'https://lnkd.in/gWbq6byx' },
        { label: 'GitHub Repository', url: 'https://github.com/RajnishKumar07/e-commerce-api-nestjs' }
      ]
    },
    {
      title: 'E-Commerce Frontend Client',
      period: 'Jan 2024 – Feb 2024',
      role: 'Lead Frontend Developer',
      description: 'A comprehensive, high-performance Angular client built to interface with the enterprise backend. Demonstrates mastery over reactive state management, lazy-loading, and responsive CSS architectures.',
      techStack: ['Angular', 'RxJS', 'Tailwind CSS', 'Firebase', 'Nx Workspace'],
      features: [
        'Implemented advanced RxJS data pipelines for shopping cart and checkout state management.',
        'Optimized core web vitals through granular standalone chunks and deferred loading.',
        'Fully responsive, pixel-perfect UI tailored for cross-browser enterprise environments.'
      ],
      links: [
        { label: 'Live Application', url: 'https://e-commerce-app-angular.web.app/' },
        { label: 'GitHub Repository', url: 'https://github.com/RajnishKumar07/app-verse' }
      ]
    }
  ] as Project[],
  education: [
    {
      degree: 'B.Tech – Computer Science Engineering',
      institution: 'Technocrats Institute of Technology & Science, Bhopal',
      period: '2018 – 2022'
    }
  ] as Education[],
  certifications: [
    {
      title: 'Cognitive Class: Docker Essentials for Developers',
      url: 'https://courses.cognitiveclass.ai/certificates/40d95da3beb846f396dec900cae15ee0'
    },
    {
      title: 'HackerRank: JavaScript (Basic)',
      url: 'https://www.hackerrank.com/certificates/iframe/042d304b7932'
    }
  ] as Certification[],
  languages: ['Hindi (Native)', 'English (Professional)']
};
