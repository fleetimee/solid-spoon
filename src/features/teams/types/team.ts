export interface TeamMember {
  id: string;
  name: string;
  nim: string;
  role: string;
  description: string;
  image?: string;
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
    role: "UI/UX Designer & Creative Lead",
    description:
      "Bertanggung jawab untuk desain antarmuka pengguna, materi presentasi, konten promosi, dan komunikasi visual. Menciptakan pengalaman pengguna yang menarik dan solusi desain visual yang komprehensif untuk proyek.",
    image: "/teams/fadil.jpeg",
    avatar: "/api/placeholder/120/120",
    skills: [
      "UI/UX Design",
      "PowerPoint",
      "Video Production",
      "Graphic Design",
      "Presentation Design",
      "Adobe Creative Suite",
      "Figma",
    ],
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
    role: "Documentation Specialist",
    description:
      "Mengelola dokumentasi proyek, penulisan teknis, dan memastikan catatan proyek yang komprehensif. Bertanggung jawab untuk membuat dan memelihara dokumentasi detail yang mendukung pengembangan proyek dan transfer pengetahuan.",
    image: "/teams/indri.jpeg",
    avatar: "/api/placeholder/120/120",
    skills: [
      "Technical Writing",
      "Documentation",
      "Research",
      "Project Analysis",
      "Content Management",
      "Quality Assurance",
    ],
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
    role: "Lead Developer",
    image: "/teams/novian.jpeg",
    description:
      "Menangani semua aspek pengembangan sistem reservasi ruangan termasuk frontend, backend, dan arsitektur sistem. Bertanggung jawab untuk implementasi teknis yang lengkap dan memastikan kualitas kode di seluruh tumpukan aplikasi.",
    avatar: "/api/placeholder/120/120",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "System Architecture",
      "Full Stack Development",
      "Database Design",
      "REST API",
      "Authentication",
    ],
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
    role: "Project Coordinator & Documentation",
    description:
      "Menangani dokumentasi proyek, koordinasi, dan memelihara hasil proyek serta laporan. Memastikan catatan proyek yang komprehensif dan memfasilitasi komunikasi dan koordinasi yang efektif antar anggota tim.",
    image: "/teams/putri.jpeg",
    avatar: "/api/placeholder/120/120",
    skills: [
      "Project Management",
      "Documentation",
      "Technical Writing",
      "Coordination",
      "Project Analysis",
      "Report Writing",
      "Team Communication",
    ],
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
