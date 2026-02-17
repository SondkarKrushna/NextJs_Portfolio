import { ValidSkills } from "./constants";

export interface ExperienceInterface {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | "Present";
  description: string[];
  achievements: string[];
  skills: ValidSkills[];
  companyUrl?: string;
  logo?: string;
}

export const experiences: ExperienceInterface[] = [
  {
    id: "ubs",
    position: "Full-stack Intern",
    company: "TechSurya IT Solutions",
    location: "Nashik, India",
    startDate: new Date("2026-01-05"),
    endDate: "Present",
    description: [
      "Developed and delivered key features for a P&L dashboard used by stakeholders, ensuring smooth functionality and user-friendly experience.",
      "Improved the frontend by migrating UI components to a consistent design system using React, enhancing overall performance and reducing UI issues.",
      "Built and automated a daily data processing system to update FX rates using backend services and database integration.",
      "Collaborated with senior developers to build REST APIs using Node.js and Express, and integrated MongoDB for efficient data storage and retrieval."
    ],
    achievements: [
      "Delivered production-ready features within the first month for a trader-facing P&L dashboard used by global stakeholders.",
      "Successfully migrated legacy UI components to a standardized React-based design system, improving UI consistency and enhancing application performance.",
      "Designed and automated a daily data ingestion pipeline for FX rates using backend services and database integration, eliminating manual updates.",
      "Built data transformation and anomaly detection pipelines on trading datasets, contributing to an award-winning solution in an internal innovation challenge.",
      "Led a 12-member team in a hackathon to develop an AI-powered tool that generates GitLab tickets, test cases, and requirement summaries, improving development workflow efficiency."
    ],
    skills: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "TailwindCSS", "HTML5", "CSS3", "Javascript"],
    companyUrl: "https://techsuryaitsolution.com/",
    logo: "/experience/techsurya.png",
  },
  {
    id: "muze-ai",
    position: "Front-end Developer Intern",
    company: "Cognifyz Technologies",
    location: "Nagpur, India",
    startDate: new Date("2025-04-16"),
    endDate: new Date("2025-05-16"),
    description: [
  "Improved application usability and performance by implementing structured UI logic and validating API responses for accurate data rendering.",
  "Developed responsive and interactive user interfaces using React, and integrated third-party services such as Slack, Google Workspace, and HubSpot via REST APIs.",
  "Optimized frontend performance by reducing loading times and improving component rendering efficiency."
],
    achievements: [
  "Enhanced frontend data handling and UI validation, improving application accuracy and user experience by ~40%.",
  "Developed and integrated REST APIs with third-party platforms such as Slack, Google Workspace, and HubSpot to enable seamless user workflows.",
  "Optimized frontend performance and reduced page load times by improving component rendering and API response handling.",
  "Designed and built a responsive Next.js analytics dashboard with interactive charts, and created a demo walkthrough explaining the implementation."
],
    skills: ["HTML5", "CSS3", "Javascript", "React", "API Integration", "JWT Auth"],
    companyUrl: "https://cognifyz.com/",
    logo: "/experience/cognifyz.png",
  },
  {
    id: "builtdesign",
    position: "Web Developer Intern",
    company: "CodeTech IT Solutions",
    location: "Hyderabad, India",
    startDate: new Date("2025-01-20"),
    endDate: new Date("2025-02-20"),
    description: [
      "Developed websites using React, Angular, and GraphQL.",
      "Set up AWS servers and CI/CD pipelines.",
      "Built a multi-page PDF reader for large files (>300MB).",
    ],
    achievements: [
      "Developed websites using React, Angular, and GraphQL; reduced API load time by 30%.",
      "Set up AWS servers and CI/CD pipelines, scaling traffic to 3,000+ users/day.",
      "Built a multi-page PDF reader for large files (>300MB) to boost user engagement.",
    ],
    skills: [
      "React",
      "Angular",
      "GraphQL",
      "AWS",
      "HTML 5",
      "CSS 3",
      "Javascript",
    ],
    companyUrl: "https://codtechitsolutions.in/",
    logo: "/experience/codetech.png",
  },
];
