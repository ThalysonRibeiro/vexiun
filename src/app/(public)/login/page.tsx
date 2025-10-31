import { CardSignIn } from "@/components/card-signIn";
import { CatalystLogo } from "@/components/catalyst-logo";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />

      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <CatalystLogo size="lg" />
          <h1 className="mt-6 text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-2 text-muted-foreground">
            Entre na sua conta para acessar seus workspaces
          </p>
        </div>

        <CardSignIn />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <a href="/" className="text-primary hover:underline">
              Voltar para a página inicial
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
