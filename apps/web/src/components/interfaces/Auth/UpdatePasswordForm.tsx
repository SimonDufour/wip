import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@metrica/ui/components/form";

import { Button } from "@metrica/ui/components/button";
import { PasswordInput } from "@metrica/ui/components/password-input";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { resetPasswordFormSchema } from "@/lib/validationSchemas";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const formSchema = resetPasswordFormSchema;

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      router.push("/protected");
      setSuccess(true);
    } catch (error) {
      console.error("Password update error", error);
      toast.error("Échec de la soumission. Veuillez réessayer.");
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Réinitialiser le mot de passe</h1>
        <p>
          Entrez votre nouveau mot de passe pour réinitialiser votre mot de
          passe.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 pt-10"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="******"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-10">
            {form.formState.isSubmitting ? (
              <LoadingSpinner />
            ) : (
              "Réinitialiser "
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
