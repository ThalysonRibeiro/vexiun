"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDeviceInfo } from "@/hooks/use-mobile";

export function LoginAlert({
  emailNotifications
}: {
  emailNotifications: boolean | null | undefined;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    // Enviar alerta de login quando o usuário acessar o dashboard
    const sendLoginAlert = async () => {
      if (session?.user?.email && emailNotifications === true) {
        try {
          const deviceInfo = getDeviceInfo();

          await fetch("/api/auth/login-alert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              deviceInfo
            })
          });
        } catch (error) {
          console.error("Erro ao enviar alerta de login:", error);
        }
      }
    };

    // Enviar apenas uma vez por sessão
    const hasSentAlert = sessionStorage.getItem("loginAlertSent");
    if (!hasSentAlert && session?.user?.email && emailNotifications === true) {
      sendLoginAlert();
      sessionStorage.setItem("loginAlertSent", "true");
    }
  }, [session, emailNotifications]);

  return null; // Este componente não renderiza nada
}
