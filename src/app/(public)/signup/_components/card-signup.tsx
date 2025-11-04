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
  FormLabel,
  FormMessage
} from "../../../../components/ui/form";
import { Input, InputPassword } from "../../../../components/ui/input";
import { useSignUpForm } from "@/hooks/use-auth";
import { Separator } from "../../../../components/ui/separator";
import { useState } from "react";

export function CardSignUp() {
  const form = useSignUpForm({});

  const handleSignIn = async (provider: SigInType) => {
    await handleRegister(provider);
  };

  const onSubmit = async (formData: { email: string; password: string }) => {
    console.log(formData);
  };

  return (
    <Card
      className="max-w-100 w-full bg-transparent border-0 p-0 shadow-none"
      data-testid="card-signup"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-semibold">Criar conta</CardTitle>
        <CardDescription>Crie sua conta e comece a trabalhar</CardDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" type="text" placeholder="Digite seu nome" {...field} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputPassword id="confirmPassword" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size={"lg"} className="w-full">
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
