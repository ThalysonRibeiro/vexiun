"use client"

import { useEffect } from "react"
import { useWorkspace } from "./use-workspace-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function WorkspaceStepForm({
  canProceed,
  form
}: {
  canProceed?: (valid: boolean) => void
  form: ReturnType<typeof useWorkspace>
}) {
  useEffect(() => {
    canProceed?.(form.formState.isValid)
  }, [form.formState.isValid, canProceed])

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} autoFocus placeholder="Digite o nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}