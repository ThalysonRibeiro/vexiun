import { NextRequest, NextResponse } from "next/server";
import { sendLoginAlertEmail } from "@/services/email.service";

export async function POST(request: NextRequest) {
  try {
    const { email, name, userAgent, deviceInfo } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Obter IP do cliente
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0] : realIp || "Desconhecido";

    // Obter informações de localização baseada no IP
    let location = "Desconhecida";
    try {
      if (ip && ip !== "Desconhecido" && !ip.startsWith("127.") && !ip.startsWith("::1")) {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
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
    const finalUserAgent = deviceInfo?.userAgent || userAgent || "Desconhecido";

    // Preparar informações do login
    const loginInfo = {
      timestamp,
      ip,
      location,
      userAgent: finalUserAgent
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
