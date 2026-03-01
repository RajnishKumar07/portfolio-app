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

export interface SkillItem {
  category: string;
  iconUrl: string;
  colorClass: string;
  items: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  about: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface PortfolioData {
  metrics: Metric[];
  personalInfo: PersonalInfo;
  skills: SkillItem[];
  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  certifications: Certification[];
  languages: string[];
}
