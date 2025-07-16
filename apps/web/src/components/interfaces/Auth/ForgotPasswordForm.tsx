import Link from "next/link";

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
import { Input } from "@metrica/ui/components/input";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";

import { emailSchema } from "@/lib/validationSchemas";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  email: emailSchema,
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error("Password reset link error", error);
      toast.error("Échec de la soumission. Veuillez réessayer.");
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      {success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-md text-sm text-center">
          ✅ Si une adresse e-mail correspondante est trouvée, un lien de
          réinitialisation vous a été envoyé.
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-bold">Mot de passe oublié?</h1>
            <p>
              Entrez votre adresse e-mail pour recevoir un lien de
              réinitialisation de mot de passe.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 pt-10"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="johndoe@mail.com"
                        type="email"
                        autoComplete="email"
                        className="h-10"
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
                  "Envoyer le lien"
                )}
              </Button>
            </form>
          </Form>

          <div className="flex flex-col gap-3 pt-6">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Vous n'avez pas oublié votre mot de passe?{" "}
              </span>
              <Link
                href="/auth/login"
                className="underline underline-offset-4 text-primary font-medium"
              >
                Connexion
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
