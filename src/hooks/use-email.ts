import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send verification email");
      }

      return response.json();
    },
    onMutate: () => {
      toast.loading("Enviando e-mail de verificação...", { id: "verify-email" });
    },
    onSuccess: () => {
      toast.success("E-mail de verificação enviado com sucesso!", { id: "verify-email" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao enviar o e-mail de verificação.", {
        id: "verify-email"
      });
      console.error("Error sending verification email:", error);
    }
  });
};
