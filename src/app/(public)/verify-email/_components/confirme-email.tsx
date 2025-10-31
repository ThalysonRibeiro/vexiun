"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logo_img from "@/assets/logo-goallist.png";

export function ConfirmEmailConmponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Token de verificação não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setMessage(
            data.message || "E-mail confirmado com sucesso! Você já pode fazer login na sua conta."
          );
          setIsSuccess(true);
        } else {
          setMessage(data.error || "Erro ao confirmar e-mail. Tente novamente.");
          setIsSuccess(false);
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
        setMessage("Erro de conexão. Tente novamente.");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  // Countdown e redirecionamento automático para sucesso
  useEffect(() => {
    if (isSuccess && !loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, loading]);

  // Redirecionamento separado quando countdown chegar a 0
  useEffect(() => {
    if (isSuccess && countdown === 0) {
      router.push("/");
    }
  }, [countdown, isSuccess, router]);

  const handleRedirectNow = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg shadow-lg text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            role="progressbar"
          ></div>
          <p className="text-gray-600 text-lg">Verificando seu e-mail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {/* Ícone de status */}
        <div className="mb-6">
          {isSuccess ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          )}
        </div>

        {/* Título */}
        <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {isSuccess ? "E-mail Verificado!" : "Erro na Verificação"}
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        {/* Ações */}
        {isSuccess ? (
          <div className="space-y-4">
            {/* Countdown */}
            <div className="bg-zinc-800 border rounded-lg p-4">
              <p className="text-sm">
                Redirecionando para a página de login em{" "}
                <span className="font-bold">{countdown}</span> segundos...
              </p>
            </div>

            {/* Botão para redirecionar imediatamente */}
            <Button onClick={handleRedirectNow}>Ir para Login Agora</Button>
          </div>
        ) : (
          <div className="space-y-3 flex flex-col">
            {/* Botão para tentar novamente */}
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>

            {/* Link para voltar à home */}
            <Button onClick={handleRedirectNow}>Voltar à Página Inicial</Button>
          </div>
        )}

        {/* Logo ou nome da empresa */}
        <div className="border-t border-gray-200">
          <Image
            src={logo_img}
            alt="DevTasks Logo"
            className="mx-auto mt-2 w-24 h-auto opacity-50"
          />
          <p className="text-gray-400 text-sm">DevTasks</p>
        </div>
      </Card>
    </div>
  );
}
