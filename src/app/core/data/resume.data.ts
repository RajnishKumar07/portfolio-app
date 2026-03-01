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

export const RESUME_DATA = {
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
  skills: {
    frontend: ['Angular (14–20)', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind CSS', 'Angular Material', 'CDK', 'HTML5/CSS3'],
    backend: ['Node.js', 'NestJS', 'Express', 'MySQL', 'TypeORM', 'WebRTC', 'Socket.io', 'JWT'],
    tools: ['Nx Workspace', 'Git', 'Docker', 'GitHub Actions', 'CI/CD', 'Swagger', 'Agile/Scrum', 'Figma']
  },
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
