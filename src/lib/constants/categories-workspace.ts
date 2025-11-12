import {
  Briefcase,
  Cpu,
  DollarSign,
  GraduationCap,
  Headphones,
  Heart,
  Megaphone,
  MoreHorizontal,
  Palette,
  TrendingUp,
  User
} from "lucide-react";

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
] as const;

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
} as const;
