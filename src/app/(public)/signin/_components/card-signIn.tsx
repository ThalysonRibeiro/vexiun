"use client";
import { handleRegister, SigInType } from "@/app/actions/auth/signIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../../../../components/ui/form";
import { Input, InputPassword } from "../../../../components/ui/input";
import { useSignInForm } from "@/hooks/use-auth";
import { Separator } from "../../../../components/ui/separator";
import { useState } from "react";

interface CardSignInProps {
  className?: string;
  title: string;
}

export function CardSignIn() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useSignInForm({});

  const handleSignIn = async (provider: SigInType) => {
    await handleRegister(provider);
  };

  const onSubmit = async (formData: { email: string; password: string }) => {
    console.log(formData);
  };

  return (
    <Card
      className="max-w-100 w-full bg-transparent border-0 p-0 shadow-none"
      data-testid="card-signin"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-semibold">Entrar</CardTitle>
        <CardDescription>Entre na sua conta e comece a trabalhar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" type="email" placeholder="Digite seu email" {...field} />
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
                  <FormControl>
                    <InputPassword id="password" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size={"sm"} className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
