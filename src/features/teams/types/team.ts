export interface TeamMember {
  id: string;
  name: string;
  nim: string;
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

// Team member data - Capstone Room Reservation System
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Fadil Biyan Eka Satria",
    nim: "048634082",
    role: "Full Stack Developer",
    description:
      "Experienced full stack developer with expertise in modern web technologies. Specialized in React, Next.js, and Node.js development with a focus on creating scalable and user-friendly applications.",
    avatar: "/api/placeholder/120/120",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    social: {
      github: "https://github.com/fadilbiyan",
      linkedin: "https://linkedin.com/in/fadilbiyan",
      email: "fadil.biyan@student.university.ac.id",
    },
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Indriyana",
    nim: "048332265",
    role: "Frontend Developer",
    description:
      "Passionate frontend developer with a keen eye for detail and user experience. Specialized in creating intuitive interfaces and responsive web applications using modern React technologies.",
    avatar: "/api/placeholder/120/120",
    skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design"],
    social: {
      github: "https://github.com/indriyana",
      linkedin: "https://linkedin.com/in/indriyana",
      email: "indriyana@student.university.ac.id",
    },
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Novian Andika",
    nim: "050193163",
    role: "Backend Developer",
    description:
      "Experienced backend developer focused on building robust and scalable server-side applications. Expert in database design, API development, and system architecture.",
    avatar: "/api/placeholder/120/120",
    skills: ["Node.js", "PostgreSQL", "REST API", "Database Design"],
    social: {
      github: "https://github.com/novianandika",
      linkedin: "https://linkedin.com/in/novianandika",
      email: "novian.andika@student.university.ac.id",
    },
    status: "active",
    joinDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Putri Nurul Adha",
    nim: "051409799",
    role: "Project Manager",
    description:
      "Organized project manager with strong leadership skills and experience in agile methodologies. Ensures smooth project delivery and effective team coordination throughout the development lifecycle.",
    avatar: "/api/placeholder/120/120",
    skills: ["Project Management", "Agile", "Scrum", "Team Leadership"],
    social: {
      github: "https://github.com/putrinurul",
      linkedin: "https://linkedin.com/in/putrinuruladha",
      email: "putri.nurul@student.university.ac.id",
    },
    status: "active",
    joinDate: "2024-01-10",
  },
];

export const teamStats: TeamStats = {
  totalMembers: teamMembers.length,
  activeProjects: 3,
  completedProjects: 12,
  yearsExperience: 5,
};
