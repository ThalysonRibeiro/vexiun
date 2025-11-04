"use client";

import { SignInFormData, signInSchema, SignUpFormData, signUpSchema } from "@/app/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export interface SignInFormProps {
  initialValues?: {
    email: string;
    password: string;
  };
}

export function useSignInForm({ initialValues }: SignInFormProps) {
  return useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: initialValues || {
      email: "",
      password: ""
    }
  });
}

export interface SignUpFormProps {
  initialValues?: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export function useSignUpForm({ initialValues }: SignUpFormProps) {
  return useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
}
