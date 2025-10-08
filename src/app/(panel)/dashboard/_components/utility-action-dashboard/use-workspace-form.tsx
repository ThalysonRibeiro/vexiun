import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  invitationUsersId: z.array(z.string()).optional(),
});

export interface UseWorkspaceProps {
  initialValues?: {
    title: string;
  }
}

export type WorkspaceFormData = z.infer<typeof formSchema>;

export function useWorkspace({ initialValues }: UseWorkspaceProps) {
  return useForm<WorkspaceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      invitationUsersId: []
    }
  })
}

