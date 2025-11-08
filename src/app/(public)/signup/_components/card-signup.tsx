"use client";
import { handleSignin, SigInType } from "@/app/actions/auth/signIn";
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
import { useSignUp, useSignUpForm } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { SignUpFormData } from "@/app/actions/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardSignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useSignUpForm({});
  const signUp = useSignUp();
  const router = useRouter();

  const handleSignIn = async (provider: SigInType) => {
    await handleSignin(provider);
  };

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      setLoading(true);
      await signUp.mutateAsync(formData);
    } finally {
      form.reset();
      setLoading(false);
      router.push("/signin");
    }
  };

  return (
    <Card className="w-xl bg-transparent border-0 p-0 shadow-none" data-testid="card-signup">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-semibold">Criar conta</CardTitle>
        <CardDescription>Crie sua conta e comece a trabalhar</CardDescription>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Digite seu nome"
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
                  <FormLabel>Senha</FormLabel>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <InputPassword
                      id="confirmPassword"
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
              className="w-full cursor-pointer mt-4"
              disabled={
                form
                  .watch(["name", "email", "password", "confirmPassword"])
                  .some((value) => value === "") || loading
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : "Criar conta"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
