export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  status: "active" | "inactive";
  joinDate: string;
}

export interface TeamStats {
  totalMembers: number;
  activeProjects: number;
  completedProjects: number;
  yearsExperience: number;
}

// Team member data extracted and enhanced from footer
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    role: "Full Stack Developer",
    description:
      "Passionate developer with expertise in modern web technologies. Specialized in React, Next.js, and Node.js development with a focus on creating scalable and user-friendly applications.",
    avatar: "/api/placeholder/120/120",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    social: {
      github: "https://github.com/johnsmith",
      linkedin: "https://linkedin.com/in/johnsmith",
      email: "john.smith@capstone.dev",
    },
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    description:
      "Creative designer with a keen eye for detail and user experience. Specialized in creating intuitive interfaces and engaging user experiences that bridge the gap between design and functionality.",
    avatar: "/api/placeholder/120/120",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    social: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahjohnson",
      email: "sarah.johnson@capstone.dev",
    },
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Backend Developer",
    description:
      "Experienced backend developer focused on building robust and scalable server-side applications. Expert in database design, API development, and cloud infrastructure management.",
    avatar: "/api/placeholder/120/120",
    skills: ["Python", "PostgreSQL", "Docker", "AWS"],
    social: {
      github: "https://github.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      email: "michael.chen@capstone.dev",
    },
    status: "active",
    joinDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Project Manager",
    description:
      "Organized project manager with strong leadership skills and experience in agile methodologies. Ensures smooth project delivery and effective team coordination throughout the development lifecycle.",
    avatar: "/api/placeholder/120/120",
    skills: ["Agile", "Scrum", "Project Planning", "Team Leadership"],
    social: {
      linkedin: "https://linkedin.com/in/emilydavis",
      email: "emily.davis@capstone.dev",
    },
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    role: "DevOps Engineer",
    description:
      "DevOps specialist focused on automation, deployment, and infrastructure management. Passionate about creating efficient CI/CD pipelines and maintaining reliable production environments.",
    avatar: "/api/placeholder/120/120",
    skills: ["Docker", "Kubernetes", "CI/CD", "Monitoring"],
    social: {
      github: "https://github.com/alexrodriguez",
      linkedin: "https://linkedin.com/in/alexrodriguez",
      email: "alex.rodriguez@capstone.dev",
    },
    status: "active",
    joinDate: "2024-02-15",
  },
];

export const teamStats: TeamStats = {
  totalMembers: teamMembers.length,
  activeProjects: 3,
  completedProjects: 12,
  yearsExperience: 5,
};
