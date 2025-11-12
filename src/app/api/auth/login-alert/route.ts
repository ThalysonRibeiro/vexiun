import { NextRequest, NextResponse } from "next/server";
import { sendLoginAlertEmail } from "@/services/email.service";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // 🔒 SEGURANÇA: Verifica se a requisição vem do servidor interno
    const secret = request.headers.get("x-internal-secret");

    if (secret !== env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, provider, timestamp: loginTimestamp, isNewUser } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Obter IP do cliente (se disponível via headers)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0] : realIp || "Desconhecido";

    // Obter User Agent
    const userAgent = request.headers.get("user-agent") || "Desconhecido";

    // Obter informações de localização baseada no IP
    let location = "Desconhecida";
    try {
      if (ip && ip !== "Desconhecido" && !ip.startsWith("127.") && !ip.startsWith("::1")) {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`, {
          // Adiciona timeout para não travar
          signal: AbortSignal.timeout(3000)
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === "success") {
            location =
              `${geoData.city || ""}, ${geoData.regionName || ""}, ${geoData.country || ""}`
                .replace(/^,\s*/, "")
                .replace(/,\s*$/, "");
          }
        }
      }
    } catch (error) {
      console.log("Erro ao obter localização:", error);
      // Não falha por causa disso
    }
    // Formatar timestamp
    const timestamp = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // Usar informações do dispositivo se disponíveis
    const loginInfo = {
      timestamp,
      ip,
      location,
      userAgent,
      provider,
      isNewUser
    };

    // Enviar email de alerta
    await sendLoginAlertEmail(email, name, loginInfo);

    return NextResponse.json({
      success: true,
      message: "Alerta de login enviado com sucesso"
    });
  } catch (error) {
    console.error("Erro ao enviar alerta de login:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor"
      },
      { status: 500 }
    );
  }
}
