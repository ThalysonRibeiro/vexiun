import { Priority, Status } from "@/generated/prisma";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSONContent } from "@tiptap/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  notes: z.string().optional(),
  description: z.string().optional(),
  details: z.custom<JSONContent>().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
});

export interface UseItemFormProps {
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    status: Status;
    notes?: string;
    description?: string;
    details?: JSONContent | null;
    assignedTo?: string | null;
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
      details: null,
      assignedTo: null,
    }
  })
}