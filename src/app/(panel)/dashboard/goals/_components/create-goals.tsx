"use client";
import { Input } from "@/components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { CreateGoalForm, UseCreateGoalForm } from "./use-create-goal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useMobile } from "@/hooks/use-mobile";
import { createGoal } from "@/app/actions/goals";
import { isErrorResponse, isSuccessResponse } from "@/lib/errors/error-handler";

interface CreateGoalProps {
  initialValues?: {
    title: string;
    desiredWeeklyFrequency: number;
  };
}

export function CreateGoals({ initialValues }: CreateGoalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMobile = useMobile();
  const form = UseCreateGoalForm({ initialValues });

  async function onSubmit(formData: CreateGoalForm) {
    setIsLoading(true);
    const response = await createGoal({
      title: formData.title,
      desiredWeeklyFrequency: formData.desiredWeeklyFrequency
    });
    if (isErrorResponse(response)) {
      toast.error(response.error);
    }
    if (isSuccessResponse(response)) {
      toast.success(response.message);
    }

    form.reset();
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Cadastrar meta</SheetTitle>
        <SheetDescription>
          Adicione atividades que te fazem bem e que você quer continuar praticando toda semana.
        </SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form className="px-4 space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual a atividade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="Praticar exercicios, meditar, etc..."
                    aria-describedby="item-name-error"
                    aria-required="true"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {isMobile ? (
            <FormField
              control={form.control}
              name="desiredWeeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantas vezes na semana</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="1x por semana" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="1">
                          <span className="text-sm font-medium leading-none">1x na semana</span>
                          <span className="text-lg leading-none">🥱</span>
                        </SelectItem>
                        <SelectItem value="2">
                          <span className="text-sm font-medium leading-none">2x na semana</span>
                          <span className="text-lg leading-none">🙂</span>
                        </SelectItem>
                        <SelectItem value="3">
                          <span className="text-sm font-medium leading-none">3x na semana</span>
                          <span className="text-lg leading-none">😎</span>
                        </SelectItem>
                        <SelectItem value="4">
                          <span className="text-sm font-medium leading-none">4x na semana</span>
                          <span className="text-lg leading-none">😜</span>
                        </SelectItem>
                        <SelectItem value="5">
                          <span className="text-sm font-medium leading-none">5x na semana</span>
                          <span className="text-lg leading-none">🤨</span>
                        </SelectItem>
                        <SelectItem value="6">
                          <span className="text-sm font-medium leading-none">6x na semana</span>
                          <span className="text-lg leading-none">🤯</span>
                        </SelectItem>
                        <SelectItem value="7">
                          <span className="text-sm font-medium leading-none">
                            Todos os dias da semana
                          </span>
                          <span className="text-lg leading-none">🔥</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="desiredWeeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantas vezes na semana</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={String(field.value)}>
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">1x na semana</span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">2x na semana</span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">3x na semana</span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">4x na semana</span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">5x na semana</span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">6x na semana</span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-sm font-medium leading-none">
                          Todos os dias da semana
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-between">
            <SheetTrigger asChild>
              <Button variant={"secondary"} className="cursor-pointer w-2/5">
                Fechar
              </Button>
            </SheetTrigger>
            <Button type="submit" className="cursor-pointer w-2/5">
              {isLoading ? (
                <div className="w-5 h-5 border border-zinc-300 border-b-primary rounded-full animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
