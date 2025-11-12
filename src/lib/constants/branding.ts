export const BRANDING = {
  name: "Vexiun",
  tagline: "AI-powered project management",
  description:
    "Vexiun é uma plataforma moderna de gestão de projetos e times, projetada para transformar visão em execução com fluidez e inteligência.",
  pronunciation: "VEKS-ee-un",

  pitch: "Vexiun — Onde a visão encontra a execução.",

  taglines: {
    main: "Project management, reimagined",
    secondary: "The smart project manager",
    ai: "AI-powered project management"
  },

  story: {
    origin: "Nome criado para representar velocidade + visão",
    meaning: "Projetos que movem rápido com clareza",
    tagline: "Move fast. Stay clear."
  },

  social: {
    twitter: {
      handle: "@vexiun_",
      url: "https://twitter.com/vexiun_"
    },
    github: {
      org: "vexiun",
      url: "https://github.com/vexiun"
    },
    linkedin: {
      company: "vexiun",
      url: "https://linkedin.com/company/vexiun"
    }
  },

  emails: {
    noreply: "noreply@vexiun.com",
    support: "support@vexiun.com",
    contact: "contact@vexiun.com",
    privacy: "privacy@vexiun.com",
    terms: "terms@vexiun.com"
  },

  domain: "vexiun.com",

  // URLs dinâmicas (usa env var)
  get url() {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  },

  get fullUrl() {
    return `https://${this.domain}`;
  }
} as const;

// Type helper
export type Branding = typeof BRANDING;
