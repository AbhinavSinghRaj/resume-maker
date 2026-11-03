import type { Resume } from "./schema";

/** Filled-in example so users can see how templates look before typing anything. */
export const sampleResume: Resume = {
  contact: {
    fullName: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka, India",
    linkedin: "https://linkedin.com/in/priyanair",
    github: "https://github.com/priyanair",
    portfolio: "",
  },
  summary:
    "Frontend engineer with 5 years of experience building fast, accessible web apps in React and TypeScript. Led the checkout rebuild at a high-traffic e-commerce company and introduced testing practices that cut production bugs. Comfortable owning features end to end, from API design to deployment.",
  experience: [
    {
      id: "sample-exp-1",
      company: "ShopKart",
      title: "Senior Frontend Engineer",
      location: "Bengaluru",
      startDate: "2022-04",
      endDate: "present",
      bullets: [
        "Rebuilt checkout in React and TypeScript, cutting page load time by 40% and drop-off by 12%",
        "Introduced Jest and Playwright suites wired into CI, reducing production bugs by 30%",
        "Mentored 4 junior engineers through code reviews and weekly pairing sessions",
      ],
    },
    {
      id: "sample-exp-2",
      company: "Finly",
      title: "Frontend Engineer",
      location: "Pune",
      startDate: "2019-07",
      endDate: "2022-03",
      bullets: [
        "Built a reusable component library used across 3 product teams",
        "Designed REST APIs in Node.js serving the mobile and web dashboards for 200K users",
      ],
    },
  ],
  education: [
    {
      id: "sample-edu-1",
      institution: "National Institute of Technology, Calicut",
      degree: "B.Tech",
      field: "Computer Science",
      startDate: "2015-07",
      endDate: "2019-05",
      score: "8.4 CGPA",
    },
  ],
  skills: [
    { category: "Languages", items: ["TypeScript", "JavaScript", "HTML", "CSS", "SQL"] },
    { category: "Frameworks & Tools", items: ["React", "Next.js", "Node.js", "Jest", "Playwright", "Git"] },
  ],
  projects: [
    {
      id: "sample-proj-1",
      name: "OpenBudget",
      url: "https://github.com/priyanair/openbudget",
      techStack: ["Next.js", "PostgreSQL", "Tailwind"],
      bullets: ["Built an open-source budgeting app with 1,200+ GitHub stars and 15 contributors"],
    },
  ],
  certifications: [{ id: "sample-cert-1", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2023-02" }],
  achievements: ["Winner, Smart India Hackathon 2018"],
  languages: ["English", "Hindi", "Malayalam"],
  customSections: [],
};
