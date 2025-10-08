import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "A cor é obrigatória"),
});

export interface UseGroupFormProps {
  initialValues?: {
    title: string;
    textColor: string;
  }
}

export type GroupFormData = z.infer<typeof formSchema>;

export function UseGroupForm({ initialValues }: UseGroupFormProps) {
  return useForm<GroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      textColor: "#FF3445"
    }
  })
}