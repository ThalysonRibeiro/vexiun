"use client";

import { useEffect, useState } from "react";

const BREAKPOINT: number = 768;

export function useMobile(breakpoint = BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export function getDeviceInfo() {
  if (typeof window === "undefined" || !window.navigator) {
    return {
      userAgent: "Desconhecido",
      platform: "Desconhecido",
      language: "pt-BR",
      screenResolution: "Desconhecido",
      timezone: "America/Sao_Paulo"
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Detectar dispositivo
  let deviceType = "Workspace";
  if (/iPad/i.test(userAgent)) {
    deviceType = "Tablet";
  } else if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
    deviceType = "Tablet";
  } else if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = "Mobile";
  }

  // Detectar navegador
  let browser = "Desconhecido";
  if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("CriOS") || userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari")) browser = "Safari";

  return {
    userAgent: `${browser} em ${deviceType}`,
    platform,
    language,
    screenResolution,
    timezone,
    fullUserAgent: userAgent
  };
}
