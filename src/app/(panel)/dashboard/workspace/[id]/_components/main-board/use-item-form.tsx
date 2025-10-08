import { Priority, Status } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  notes: z.string()
    .min(1, "Notas é obrigatória")
    .max(300, "A nota da terefa deve ter no máximo 300 caracteres."),
  description: z.string()
    .min(1, "A descrição é obrigatória")
    .max(500, "A descrição da terefa deve ter no máximo 500 caracteres."),
});

export interface UseItemFormProps {
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    status: Status;
    notes: string;
    description: string;
  }
}

export type ItemFormData = z.infer<typeof formSchema>;

export function UseItemForm({ initialValues }: UseItemFormProps) {
  return useForm<ItemFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      term: new Date(),
      priority: "STANDARD",
      status: "NOT_STARTED",
      notes: "",
      description: "",
    }
  })
}