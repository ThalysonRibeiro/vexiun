"use client";
import { handleCredentialsSignIn, handleSignin, SigInType } from "@/app/actions/auth/signIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { useSignInForm } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { SignInFormData } from "@/app/actions/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardSignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useSignInForm({});
  const router = useRouter();

  const handleSignIn = async (provider: SigInType) => {
    await handleSignin(provider);
  };

  const onSubmit = async (formData: SignInFormData) => {
    try {
      setLoading(true);
      await handleCredentialsSignIn(formData.email, formData.password);
    } finally {
      setLoading(false);
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-xl bg-transparent border-0 p-0 shadow-none" data-testid="card-signin">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-semibold">Entrar</CardTitle>
        <CardDescription>Entre na sua conta e comece a trabalhar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => handleSignIn("github")}
            className="w-full cursor-pointer"
          >
            <FaGithub /> GitHub
          </Button>
          <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => handleSignIn("google")}
            className="w-full cursor-pointer"
          >
            <FcGoogle /> Google
          </Button>
        </div>

        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Senha</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="cursor-pointer"
                      onClick={() => alert("Recupearar")}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <FormControl>
                    <InputPassword
                      id="password"
                      placeholder="Digite sua senha"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size={"lg"}
              className={"w-full mt-4 cursor-pointer"}
              disabled={form.watch(["email", "password"]).some((value) => value === "") || loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
