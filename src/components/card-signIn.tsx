"use client";
import { handleRegister, SigInType } from "@/app/(public)/_action/signIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function CardSignIn() {
  async function handleSignIn(provider: SigInType) {
    await handleRegister(provider);
  }

  return (
    <Card className="max-w-100 w-full bg-background" data-testid="card-signin">
      <CardHeader>
        <CardTitle className="text-center">SignIn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={"outline"}
          onClick={() => handleSignIn("github")}
          className="w-full cursor-pointer"
        >
          <FaGithub /> GitHub
        </Button>
        <Button
          variant={"outline"}
          onClick={() => handleSignIn("google")}
          className="w-full cursor-pointer"
        >
          <FcGoogle /> Google
        </Button>
      </CardContent>
    </Card>
  );
}
