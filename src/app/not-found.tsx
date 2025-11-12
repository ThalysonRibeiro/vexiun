import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function NotFound() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="relative overflow-hidden flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md">
        <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
          <style>
            {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes shake-head {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-3deg); }
            75% { transform: rotate(3deg); }
          }
          
          @keyframes blink-x {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0.3; }
          }
          
          @keyframes swing-arm {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
          }
          
          .robot-body {
            animation: float 3s ease-in-out infinite;
            transform-origin: center;
          }
          
          .robot-head {
            animation: shake-head 4s ease-in-out infinite;
            transform-origin: center;
          }
          
          .robot-eyes {
            animation: blink-x 3s ease-in-out infinite;
          }
          
          .robot-arm-left {
            animation: swing-arm 2s ease-in-out infinite;
            transform-origin: 70px 125px;
          }
          
          .robot-arm-right {
            animation: swing-arm 2s ease-in-out infinite reverse;
            transform-origin: 130px 125px;
          }
        `}
          </style>

          <g className="robot-body">
            {/* Cabeça retangular (monitor) */}
            <g className="robot-head">
              <rect
                x="50"
                y="20"
                width="100"
                height="75"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                rx="6"
              />

              {/* Olhos tristes/confusos - X nos olhos */}
              <g className="robot-eyes">
                {/* Olho esquerdo - X */}
                <line
                  x1="72"
                  y1="45"
                  x2="88"
                  y2="75"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="88"
                  y1="45"
                  x2="72"
                  y2="75"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Olho direito - X */}
                <line
                  x1="110"
                  y1="45"
                  x2="126"
                  y2="75"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="126"
                  y1="45"
                  x2="110"
                  y2="75"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Pescoço */}
            <rect
              x="88"
              y="95"
              width="24"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
            />

            {/* Peito (cápsula horizontal) */}
            <rect
              x="70"
              y="113"
              width="60"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              rx="12"
            />

            {/* Linha divisória vertical no peito */}
            <line x1="100" y1="113" x2="100" y2="137" stroke="currentColor" strokeWidth="7" />

            {/* Braço esquerdo - caído */}
            <g className="robot-arm-left">
              <path
                d="M 70 125 Q 55 140, 55 170"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Mão esquerda */}
              <circle cx="55" cy="183" r="13" fill="none" stroke="currentColor" strokeWidth="7" />
            </g>

            {/* Braço direito - caído */}
            <g className="robot-arm-right">
              <path
                d="M 130 125 Q 145 140, 145 170"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Mão direita */}
              <circle cx="145" cy="183" r="13" fill="none" stroke="currentColor" strokeWidth="7" />
            </g>

            {/* Quadril/barriga trapezoidal */}
            <path
              d="M 75 137 L 75 175 L 125 175 L 125 137"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinejoin="miter"
            />

            {/* Perna esquerda */}
            <line
              x1="85"
              y1="175"
              x2="75"
              y2="220"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Perna direita */}
            <line
              x1="115"
              y1="175"
              x2="125"
              y2="220"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Pé esquerdo */}
            <path
              d="M 75 220 L 75 235 L 58 235 Q 50 235, 50 243 Q 50 251, 58 251 L 75 251 L 75 220"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinejoin="round"
            />

            {/* Pé direito */}
            <path
              d="M 125 220 L 125 235 L 142 235 Q 150 235, 150 243 Q 150 251, 142 251 L 125 251 L 125 220"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <h1 className="text-9xl font-bold tracking-tighter text-foreground animate-pulse">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Página não encontrada</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Ops! O Vexiun procurou em todos os circuitos, mas essa página não existe.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
