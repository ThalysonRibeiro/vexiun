import { Vexiun } from "@/components/vexiun";
import getSession from "@/lib/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CardSignUp } from "./_components/card-signup";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[60px_60px]" />
      <div className="w-xl flex flex-col items-center justify-center max-w-md space-y-4 p-8">
        <Link href="/" className="uppercase absolute left-10 top-4">
          Inicio
        </Link>

        <Vexiun size="xl" robot={false} />

        <CardSignUp />

        <div className="w-xl text-center">
          <p className="text-sm text-muted-foreground">
            Ja tem uma conta?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
          <div className="w-full flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
            <p>Ao se cadastrar, você concorda com nossos</p>
            <Link href={"/"} className="text-primary hover:underline">
              Termos
            </Link>
            {","}
            <Link href={"/"} className="text-primary hover:underline">
              Política de Uso Aceitável
            </Link>
            {"e"}
            <Link href={"/"} className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}
