// Every fact on the site lives in this file. Sources: Ritesh's LinkedIn profile
// (Nov 2026) and resume. Do not add anything that is not in those sources.

// The shareable preview is served from a sub-folder, so its files use relative paths.
const base = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1" ? "." : "";

export const site = {
  url: "https://www.riteshjena.co.in",
  name: "Ritesh Jena",
  title: "Software Consultant",
  company: "ITPlusPoint",
  location: "Bhubaneswar, Odisha, India",
  email: "riteshjena2002@gmail.com",
  linkedin: "https://www.linkedin.com/in/ritesh-jena-8b2b2326b/",
  // Add the GitHub profile URL here once confirmed; the link appears automatically.
  github: "" as string,
  resume: `${base}/Ritesh-Jena-Resume.pdf`,
  photo: `${base}/ritesh-jena.jpg`,
  description:
    "Ritesh Jena is a Software Consultant at ITPlusPoint in Bhubaneswar, building enterprise web applications in ASP.NET MVC, React and SQL Server, and adding generative and agentic AI to them.",
};

export const hero = {
  role: "Software Consultant",
  company: "ITPlusPoint",
  since: "Since Nov 2023",
  coords: "20.2961° N · 85.8245° E",
  place: "Bhubaneswar, Odisha",
  tagline: "I build the .NET and React systems businesses run on, and wire AI into them where it saves real hours.",
  intro:
    "Three years at ITPlusPoint, from writing my first C# and SQL as a pre-intern to building CRMs, investment platforms and agentic AI tools as a consultant.",
};

// Read word by word in the About section.
export const manifesto =
  "I joined ITPlusPoint as a pre-intern in November 2023. Six roles in, I take a feature from the SQL table to the screen, and I add AI only where it takes real work off someone's desk.";

export const about = {
  paragraphs: [
    "I joined ITPlusPoint in November 2023 as a pre-intern, a few months after finishing my B.Tech at Synergy Institute of Technology. Over the next year I moved through software engineering, UI/UX and testing internships and a trainee role. That path is why I think about a feature from the database table all the way up to the button someone presses.",
    "Since November 2024 I have worked as a Software Consultant. Most of my work is ASP.NET MVC and Web API on SQL Server, with React or jQuery in front. A growing share of it is generative AI: ChatGPT-powered content tools, document-driven chat systems and agentic workflows that take repetitive steps off people's desks.",
    "I also lead and mentor developers on my team. In January 2026 I mentored teams at Srusti Tech Hack 2.0, a state-level hackathon, and in December 2025 ITPlusPoint gave me its Power Programmer 2025 award.",
  ],
  principles: [
    {
      title: "Data model first",
      body: "Billing, membership and investment records have to be right. I start with the tables and the validation rules, then build the screens on top.",
    },
    {
      title: "Tested before it ships",
      body: "A testing internship taught me to break my own work before users do. Debugging and test passes are part of the job, not an afterthought.",
    },
    {
      title: "AI where it pays",
      body: "I add an LLM when it removes real manual work, like drafting content or answering from documents, and keep plain code everywhere else.",
    },
  ],
};

export const services = [
  {
    id: "enterprise",
    title: "Enterprise web applications",
    body: "CRM, organisation and brand management, and housing society systems with member, property and billing modules.",
    tags: ["ASP.NET MVC", "C#", "SQL Server"],
  },
  {
    id: "api",
    title: "APIs and integrations",
    body: "REST APIs on ASP.NET Web API, and third-party integrations such as Google Maps, Google Search Console and the ChatGPT API.",
    tags: ["Web API", "REST", "Postman"],
  },
  {
    id: "data",
    title: "Database design",
    body: "SQL Server schemas, Entity Framework and EF Core data access, and backend validation that keeps records consistent.",
    tags: ["SQL Server", "EF Core", "SSMS"],
  },
  {
    id: "ai",
    title: "AI integration",
    body: "Chatbots, prompt engineering, context-aware and document-driven chat, and agentic workflows built on several LLM APIs.",
    tags: ["Generative AI", "AI agents", "ChatGPT API"],
  },
  {
    id: "frontend",
    title: "Front-end and dashboards",
    body: "Responsive interfaces and investment dashboards in React, jQuery and Bootstrap that stay usable on a phone.",
    tags: ["React.js", "JavaScript", "Bootstrap"],
  },
  {
    id: "mentoring",
    title: "Team leadership and mentoring",
    body: "Leading and mentoring developers on delivery and code quality, and mentoring hackathon teams at Srusti Tech Hack 2.0.",
    tags: ["Mentorship", "Code review"],
  },
];

export type SkillGroup = { id: string; label: string; layer: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { id: "languages", label: "Languages", layer: "L0", items: ["C#", "JavaScript", "SQL", "HTML5", "CSS3"] },
  {
    id: "backend",
    label: "Backend",
    layer: "L1",
    items: [".NET Framework", "ASP.NET MVC", "Web API", "REST APIs", "Entity Framework", "EF Core"],
  },
  { id: "frontend", label: "Frontend", layer: "L2", items: ["React.js", "jQuery", "Bootstrap", "Responsive design"] },
  { id: "database", label: "Database", layer: "L3", items: ["SQL Server", "SQL Server Management Studio"] },
  {
    id: "ai",
    label: "AI and integration",
    layer: "L4",
    items: [
      "Generative AI",
      "ChatGPT API",
      "Agentic AI",
      "AI agents",
      "Prompt engineering",
      "AI chatbots",
      "Google Maps API",
      "Google Search Console API",
    ],
  },
  { id: "quality", label: "Testing", layer: "L5", items: ["System testing", "Debugging"] },
  { id: "tools", label: "Tools", layer: "L6", items: ["Git", "GitHub", "Postman", "Visual Studio", "VS Code"] },
  { id: "deploy", label: "Deployment", layer: "L7", items: ["Vercel", "Mocha Host"] },
];

export type Role = {
  title: string;
  type: string;
  start: string;
  end: string;
  duration: string;
  summary: string;
  skills: string[];
};

// Newest first. All roles at ITPlusPoint, Bhubaneswar.
export const roles: Role[] = [
  {
    title: "Software Consultant",
    type: "Full-time",
    start: "Nov 2024",
    end: "Present",
    duration: "2 yrs 1 mo",
    summary:
      "Full-stack work on enterprise web apps, CRM systems, AI platforms and automation for several business domains. Leads and mentors the development team, and builds AI chatbots and agentic AI proofs of concept.",
    skills: ["ASP.NET MVC", "React.js", "SQL Server", "Generative AI", "AI agents"],
  },
  {
    title: "Trainee",
    type: "Full-time",
    start: "Feb 2024",
    end: "Nov 2024",
    duration: "10 mos",
    summary: "Worked on production modules with React.js and started building with generative AI and the ChatGPT API.",
    skills: ["Gen AI (ChatGPT)", "React.js"],
  },
  {
    title: "Internship Trainee, Testing",
    type: "Full-time",
    start: "Mar 2024",
    end: "Mar 2024",
    duration: "1 mo",
    summary: "System testing and test passes on company projects. Completed with a software testing certificate.",
    skills: ["System testing", "Testing"],
  },
  {
    title: "UI & UX Internship",
    type: "Full-time",
    start: "Mar 2024",
    end: "Mar 2024",
    duration: "1 mo",
    summary: "Interface design and front-end work in HTML and JavaScript. Completed with a UI/UX internship certificate.",
    skills: ["HTML", "JavaScript", "UI/UX"],
  },
  {
    title: "Software Engineer Internship",
    type: "Internship",
    start: "Dec 2023",
    end: "Feb 2024",
    duration: "3 mos",
    summary: "Trained on the ASP.NET, MVC and MS SQL Server stack, with data access through Entity Framework and EF Core.",
    skills: ["ASP.NET MVC", "EF Core", "Entity Framework"],
  },
  {
    title: "Pre-internship",
    type: "Internship",
    start: "Nov 2023",
    end: "Dec 2023",
    duration: "2 mos",
    summary: "First steps at ITPlusPoint: C# fundamentals and SQL Server Management Studio.",
    skills: ["C#", "SSMS"],
  },
];

export const milestones = [
  { date: "Dec 2025", label: "Power Programmer 2025 award, ITPlusPoint Group of Companies" },
  { date: "Jan 2026", label: "Mentor at Srusti Tech Hack 2.0, a state-level hackathon" },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  overview: string;
  role: string;
  features: string[];
  contributions: string[];
  stack: string[];
  live?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "leadgen",
    name: "LeadGen",
    kind: "AI lead generation platform",
    overview:
      "A platform that finds business leads by location and by sector, then helps the team filter them, export them and run campaigns against them.",
    role: "Developer, ITPlusPoint",
    features: [
      "Location-based and sector-wise lead extraction",
      "Filtering and smart data handling",
      "Excel export",
      "Campaign targeting and messaging",
    ],
    contributions: [
      "Built the lead extraction on the Google Search Console and Google Maps APIs.",
      "Implemented filtering, Excel export, campaign targeting and messaging.",
    ],
    stack: ["Google Maps API", "Google Search Console API"],
  },
  {
    slug: "green-parrot",
    name: "Green Parrot",
    kind: "Organisation and brand management system",
    overview: "An internal system for managing organisations and the brands under them.",
    role: "Developer, ITPlusPoint",
    features: ["Organisation management", "Brand management", "CRUD modules for both"],
    contributions: [
      "Developed the CRUD modules for organisation and brand management.",
      "Improved stability through testing, debugging and feature enhancements.",
    ],
    stack: ["ASP.NET MVC", "SQL Server", "JavaScript", "Bootstrap"],
  },
  {
    slug: "society-life",
    name: "Society Life",
    kind: "Housing society management system",
    overview: "A management system for residential societies covering members, properties and billing.",
    role: "Developer, ITPlusPoint",
    features: ["Member registration", "Property management", "Billing management"],
    contributions: [
      "Implemented the member registration, property and billing modules.",
      "Added backend validations to protect data integrity.",
      "Improved UI responsiveness and performance.",
    ],
    stack: [],
  },
  {
    slug: "social-media",
    name: "Social Media Management System",
    kind: "AI content and workflow automation",
    overview: "A social media management tool that uses AI to draft content and automate the posting workflow.",
    role: "Developer, ITPlusPoint",
    features: ["AI-generated content", "Workflow automation"],
    contributions: [
      "Integrated the ChatGPT API for content generation and workflow automation.",
      "Improved performance through debugging and testing.",
    ],
    stack: ["ChatGPT API"],
  },
  {
    slug: "mycropcapital",
    name: "MyCropCapital",
    kind: "Agricultural investment platform",
    overview: "A platform that connects farmers with investors and shows investors how their projects are doing.",
    role: "Developer, ITPlusPoint",
    features: ["Investment tracking dashboards", "Project listings", "Real-time investment insights"],
    contributions: [
      "Developed the investment tracking dashboards and responsive interfaces.",
      "Implemented project listing and real-time investment insights.",
    ],
    stack: [],
  },
  {
    slug: "blocks",
    name: "Blocks Investment",
    kind: "Commercial real estate investment platform",
    overview: "A platform for investing in commercial property, from browsing listings to comparing options.",
    role: "Developer, ITPlusPoint",
    features: ["Property listings", "Filtering and comparison", "Investment insights"],
    contributions: [
      "Built the commercial property investment modules: listing, filtering, comparison and insights.",
      "Designed the responsive UI and streamlined the user workflows.",
    ],
    stack: [],
  },
  {
    slug: "ai-lab",
    name: "AI POCs and chatbots",
    kind: "Applied AI proofs of concept",
    overview:
      "An ongoing run of AI proofs of concept and chatbots, used to test ideas quickly before they go into client products.",
    role: "Developer, ITPlusPoint",
    features: [
      "Context-aware chat systems",
      "Document-driven AI workflows",
      "AI automation pipelines",
      "Prompt engineering",
    ],
    contributions: [
      "Built 20+ chatbot proofs of concept using several LLM APIs.",
      "Used AI tools to speed up development and project delivery.",
    ],
    stack: ["Generative AI", "ChatGPT API", "Prompt engineering", "AI agents"],
  },
];

export const recognition = [
  {
    title: "Power Programmer 2025",
    issuer: "ITPlusPoint Group of Companies",
    date: "Dec 2025",
    body: "Awarded for technical expertise, problem-solving and consistent contributions to software development.",
  },
  {
    title: "Mentor, Srusti Tech Hack 2.0",
    issuer: "Srusti Academy of Management and Technology",
    date: "30–31 Jan 2026",
    body: "Mentored 500+ participants at a state-level hackathon and was recognised for the mentoring.",
  },
  {
    title: "TiECon Bhubaneswar 2026",
    issuer: "Odisha Leap Up Summit",
    date: "30–31 Oct 2026",
    body: "Attended the TiE entrepreneurship summit in Bhubaneswar.",
  },
];

export const certifications = [
  { title: "Build an AI Agent", issuer: "IBM", date: "Mar 2026" },
  { title: "Artificial Intelligence Governance Professional (AIGP)", issuer: "Udemy", date: "2026" },
  { title: "Artificial Intelligence Beginners Guide: What is AI?", issuer: "Simplilearn SkillUp", date: "" },
  { title: "Software Engineer Internship (ASP.NET, MVC, MS SQL Server)", issuer: "ITPlusPoint", date: "2024" },
  { title: "UI & UX Internship", issuer: "ITPlusPoint", date: "2024" },
  { title: "Software Testing", issuer: "ITPlusPoint", date: "2024" },
];

export const education = [
  {
    school: "Synergy Institute of Technology",
    place: "Pahala, Bhubaneswar",
    degree: "Bachelor of Technology",
    years: "2019 – 2023",
  },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#services", label: "What I do" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];
