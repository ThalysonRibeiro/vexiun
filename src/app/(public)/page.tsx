import { CardSignIn } from "@/components/card-signIn";
import Image from "next/image";
import logo_img from "@/assets/logo-goallist.png";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TestimonialsSectionMultipleRows } from "@/components/testimonials";
import { CatalystLogo } from "@/components/catalyst-logo";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <div className="absolute top-4 left-4">
        <CatalystLogo size="lg" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />

      {/* Hero Section */}
      <section id="hero" className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="flex flex-col justify-betweengap-10 items-center">
          <div className="flex flex-col text-left">
            <h2 className="text-5xl md:text-6xl font-bold uppercase text-center bg-radial from-primary via-orange-500 to-primary bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] mb-6">
              Gerencie suas tarefas
              <br />com eficiência
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground text-center md:text-left mb-10">
              Uma plataforma simples e poderosa para organizar suas tarefas de desenvolvimento e aumentar sua produtividade.
            </p>
          </div>

          <CardSignIn />


        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">O que os desenvolvedores dizem</h2>
        <TestimonialsSectionMultipleRows maxRows={3} />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para aumentar sua produtividade?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Comece a organizar suas tarefas de desenvolvimento hoje mesmo e veja a diferença na sua produtividade.
        </p>
        <CardSignIn />
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-zinc-800 rounded-full relative">
              <Image
                src={logo_img}
                alt="imagem do logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">Dev Tasks © {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Termos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}