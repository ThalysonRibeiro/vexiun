"use client"

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UserWithCounts } from "../types/profile-types";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { UseSettingsForm, useUpdateSettings } from "@/hooks/use-user";
import { SettingsFormData } from "@/app/actions/user";
import { useMutation } from "@tanstack/react-query";
import { useSendVerificationEmail } from "@/hooks/use-email";

export default function AccountSecurity({ detailUser }: { detailUser: UserWithCounts }) {
  const isVerified = detailUser.emailVerified !== null;
  const updateSettings = useUpdateSettings();
  const sendVerificationEmail = useSendVerificationEmail();

  if (!detailUser.userSettings) {
    return null
  }

  const form = UseSettingsForm({
    initialValues: {
      emailNotifications: detailUser.userSettings?.emailNotifications,
      pushNotifications: detailUser.userSettings?.pushNotifications,
      language: detailUser.userSettings?.language,
      timezone: detailUser.userSettings?.timezone,
    }
  });

  const timeZone = Intl.supportedValuesOf("timeZone").filter(zone =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")
  );

  const languages = ["pt-BR", "en-US"];

  const handleSendVerification = () => {
    sendVerificationEmail.mutate(detailUser.email);
  };

  // Acesso ao estado da mutation
  const { isPending, isError, isSuccess } = sendVerificationEmail;

  const onSubmit = async (formData: SettingsFormData) => {
    if (!detailUser.id) {
      return;
    }

    const response = await updateSettings.mutateAsync({
      userId: detailUser.id,
      emailNotifications: formData.emailNotifications,
      pushNotifications: formData.pushNotifications,
      language: formData.language,
      timezone: formData.timezone,
      revalidatePaths: ["/dashboard/profile"]
    });
    if (!isSuccessResponse(response)) {
      toast.error("Erro ao atualizar configurações de segurança");
      return;
    }
    toast.success(response.message || "Configurações de segurança atualizadas com sucesso!");
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="space-y-4 p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Email verificado</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-orange-700" />
                <span className="font-semibold text-orange-700">E-mail não verificado</span>
              </>
            )}
          </div>
          <p className="text-sm">
            {isVerified
              ? `Seu e-mail foi verificado em ${detailUser.emailVerified?.toLocaleDateString()}`
              : 'Verifique seu e-mail e clique no link de verificação para proteger sua conta.'
            }
          </p>
          {!isVerified && (
            <Button className="cursor-pointer" size="sm" onClick={handleSendVerification}>
              Reenviar e-mail de verificação
            </Button>
          )}
        </div>

        {/* Security Settings */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-4 rounded-xl border"
          >
            <h3 className="font-semibold text-lg">Configurações de segurança</h3>

            <div className="opacity-50 cursor-not-allowed border flex items-center justify-between py-3 px-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Autenticação de dois fatores</span>
              </div>
              <Switch
                checked={false}
                className="cursor-not-allowed"
              />
            </div>

            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center rounded-lg border p-3 shadow-sm">
                  <Shield className="w-6 h-6" />
                  <div className="space-y-0.5">
                    <FormLabel>Ativar alerta</FormLabel>
                    <FormDescription>
                      Alertas de login via email
                    </FormDescription>
                  </div>
                  <FormControl className="ml-auto">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex sm:flex-row flex-col gap-3 justify-between">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuso horário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeZone.map((timeZone) => (
                          <SelectItem key={timeZone} value={timeZone}>
                            {timeZone}
                          </SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione seu fuso horário
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione seu idioma
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <Button type="submit" size="sm" className="cursor-pointer">
              Salvar
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
};