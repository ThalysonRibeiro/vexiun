"use client";

import { User } from "next-auth";
import { NameForme } from "./name-form";
import Avatar from "./avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccountSecurity from "./account-security";
import { Shield } from "lucide-react";
import AccountStats from "./account-stats";
import { UserWithCounts } from "../types/profile-types";

export function ProfileContent({
  sessionUser,
  detailUser
}: {
  sessionUser: User;
  detailUser: UserWithCounts;
}) {
  return (
    <div className="space-y-6 mt-6 mb-10">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações de perfil</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-6 flex-col md:flex-row items-center">
          <div className="max-w-50">
            <Avatar avatarUrl={sessionUser.image || ""} userId={sessionUser.id || ""} />
            <p className="text-sm text-gray-500 mt-2">Formatos suportados</p>
            <span className="text-sm text-gray-500 mt-2">.png, .jpeg, .webp</span>
          </div>
          <div className="w-full flex-col mt-auto items-center xl:flex-row flex gap-4">
            <NameForme user={sessionUser} />
            <div className="w-full space-x-1 p-4 border rounded-lg opacity-50 cursor-not-allowed">
              <label className="label">
                <span className="label-text cursor-not-allowed">E-mail:</span>
              </label>
              <span className="text-sm cursor-not-allowed">{sessionUser.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Segurança da conta</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6 flex-col md:flex-row">
          <AccountSecurity detailUser={detailUser} />
          <AccountStats detailUser={detailUser} />
        </CardContent>
      </Card>
    </div>
  );
}
