import { WorkspaceCategory, WorkspaceRole } from "@/generated/prisma";
import {
  User,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  Palette,
  Cpu,
  Megaphone,
  TrendingUp,
  Headphones,
  MoreHorizontal
} from "lucide-react";

export const branding = {
  // Nome oficial
  name: "Vexiun",
  domain: "vexiun.com",

  email: "noreply@vexiun.com",
  support: "support@vexiun.com",
  contact: "contact@vexiun.com",
  privacy: "privacy@vexiun.com",
  terms: "terms@vexiun.com",

  // Marketing
  tagline1: "Project management, reimagined",
  tagline2: "The smart project manager",
  tagline3: "AI-powered project management",
  description:
    "Vexiun é uma plataforma moderna de gestão de projetos e times, projetada para transformar visão em execução com fluidez e inteligência.",
  pitch: "Vexiun — Onde a visão encontra a execução.",

  // Pronuncia:
  pronunciation: "VEKS-ee-un",

  story: {
    origin: "Nome criado para representar velocidade + visão",
    meaning: "Projetos que movem rápido com clareza",
    tagline: "Move fast. Stay clear."
  },
  // Social
  twitter: "@vexiun",
  linkedin: "vexiun",
  github: "vexiun"
};

export const CACHE_TIMES = {
  SHORT: 1 * 60 * 1000, // 1min - dados frequentes
  MEDIUM: 5 * 60 * 1000, // 5min - dados normais
  LONG: 15 * 60 * 1000, // 15min - dados estáveis
  PERMANENT: Infinity // Dados imutáveis
} as const;

export const CATEGORIES_ARRAY = [
  { id: "PERSONAL", label: "Pessoal", icon: User },
  { id: "WORK", label: "Trabalho", icon: Briefcase },
  { id: "EDUCATION", label: "Educação", icon: GraduationCap },
  { id: "HEALTH", label: "Saúde", icon: Heart },
  { id: "FINANCE", label: "Finanças", icon: DollarSign },
  { id: "CREATIVE", label: "Criativo", icon: Palette },
  { id: "TECHNOLOGY", label: "Tecnologia", icon: Cpu },
  { id: "MARKETING", label: "Marketing", icon: Megaphone },
  { id: "SALES", label: "Vendas", icon: TrendingUp },
  { id: "SUPPORT", label: "Suporte", icon: Headphones },
  { id: "OTHER", label: "Outros", icon: MoreHorizontal }
];

export const CATEGORIES_MAP = {
  PERSONAL: "Pessoal",
  WORK: "Trabalho",
  EDUCATION: "Educação",
  HEALTH: "Saúde",
  FINANCE: "Finanças",
  CREATIVE: "Criativo",
  TECHNOLOGY: "Tecnologia",
  MARKETING: "Marketing",
  SALES: "Vendas",
  SUPPORT: "Suporte",
  OTHER: "Outros"
};

export const UI_LABELS = {
  ASSIGN: "Atribuir",
  ASSIGN_TO: "Atribuir a",
  ASSIGNED_TO: "Atribuído a",
  ASSIGNEE: "Responsável",
  UNASSIGNED: "Não atribuído",
  REASSIGN: "Reatribuir"
} as const;

export const roleDescriptions: Record<WorkspaceRole, string> = {
  OWNER: "Proprietário do workspace com controle total",
  ADMIN: "Administrador com permissões completas de gerenciamento",
  MEMBER: "Membro com acesso padrão ao workspace",
  VIEWER: "Visualizador com acesso apenas leitura"
};

export const TESTIMONIALS = [
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Maria Programadora",
    role: "Fullstack Developer",
    initials: "MP"
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "João Desenvolvedor",
    role: "Frontend Developer",
    initials: "JD"
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Ana Engenheira",
    role: "Software Engineer",
    initials: "AE"
  },
  {
    quote:
      "A visualização de progresso e as estatísticas me ajudam a entender onde estou gastando meu tempo e como posso melhorar.",
    author: "Carlos Programador",
    role: "Backend Developer",
    initials: "CP"
  },
  {
    quote:
      "Finalmente consegui organizar meus projetos de forma eficiente. As notificações me mantêm sempre no cronograma.",
    author: "Beatriz Silva",
    role: "Product Manager",
    initials: "BS"
  },
  {
    quote:
      "A interface intuitiva fez toda a diferença na minha produtividade diária. Recomendo para toda equipe de desenvolvimento.",
    author: "Pedro Santos",
    role: "Tech Lead",
    initials: "PS"
  },
  {
    quote:
      "Os relatórios detalhados me permitem apresentar dados concretos nas reuniões de sprint. É uma ferramenta essencial.",
    author: "Luana Costa",
    role: "Scrum Master",
    initials: "LC"
  },
  {
    quote:
      "A sincronização entre dispositivos é perfeita. Posso acompanhar meu trabalho tanto no escritório quanto em casa.",
    author: "Rafael Oliveira",
    role: "Mobile Developer",
    initials: "RO"
  },
  {
    quote:
      "As métricas de performance me ajudaram a identificar gargalos no meu workflow que eu nem sabia que existiam.",
    author: "Camila Torres",
    role: "DevOps Engineer",
    initials: "CT"
  },
  {
    quote:
      "Sistema robusto e confiável. Desde que comecei a usar, minha organização pessoal melhorou significativamente.",
    author: "Diego Ferreira",
    role: "Data Engineer",
    initials: "DF"
  },
  {
    quote:
      "A possibilidade de customizar dashboards tornou o acompanhamento do progresso muito mais visual e motivador.",
    author: "Fernanda Lima",
    role: "UX/UI Designer",
    initials: "FL"
  },
  {
    quote:
      "Integração perfeita com as ferramentas que já uso. Não precisei mudar meu fluxo de trabalho, apenas otimizei ele.",
    author: "Thiago Nascimento",
    role: "Solutions Architect",
    initials: "TN"
  }
];
