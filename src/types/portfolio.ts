// src/types/portfolio.ts

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  rollNo?: string;
  university?: string;
  universityEmail?: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export interface Section {
  id: 'hero' | 'about' | 'experience' | 'skills' | 'projects' | 'contact';
  title: string;
  subtitle: string;
  content: string;
  highlights?: string[];
  cta?: string;
  stats?: {
    [key: string]: string;
  };
  positions?: Position[];
  categories?: SkillCategory[];
  projects?: Project[];
  contactInfo?: ContactInfo;
}

export interface Position {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  links: {
    demo: string;
    github: string;
    live: string;
  };
  featured: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  specialization?: string;
  board?: string;
  percentage?: string;
  current: boolean;
}

export interface Leadership {
  title: string;
  organization: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Achievement {
  title: string;
  description: string;
  year: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  sections: Section[];
  education: Education[];
  leadership: Leadership[];
  achievements: Achievement[];
  interests: string[];
}

// Export type for typed JSON import
export type PortfolioJSON = PortfolioData;