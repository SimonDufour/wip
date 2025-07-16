import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginFormSchema } from "@/lib/validationSchemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@metrica/ui/components/form";

import { Icons } from "@metrica/ui/components/icons";
import { Button } from "@metrica/ui/components/button";
import { Input } from "@metrica/ui/components/input";
import { PasswordInput } from "@metrica/ui/components/password-input";
import { AuthError, Provider } from "@supabase/supabase-js";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const formSchema = loginFormSchema;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoadingOAuth, setIsLoadingOAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      router.push("/dashboard/projects");
    } catch (error: any) {
      if (
        error instanceof AuthError &&
        error.name === "AuthApiError" &&
        error.message.includes("Invalid login credentials")
      ) {
        setError("Mot de passe ou adresse e-mail invalide");
      } else {
        console.error("Form submission error", error);
        toast.error("Échec de la soumission. Veuillez réessayer.");
      }
    }
  }

  async function onSubmitOAuth(provider: Provider) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard/projects`,
          queryParams: {
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error("Échec de la soumission. Veuillez réessayer.");
    } finally {
      setIsLoadingOAuth(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Connexion</h1>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Pas encore de compte? </span>
          <Link
            href="/auth/sign-up"
            className="underline underline-offset-4 text-primary font-medium"
          >
            Créer un compte
          </Link>
        </div>
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
                <FormLabel htmlFor="email">E-mail</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="E-mail"
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="password">Mot de passe</FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline text-primary"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="Mot de passe"
                    autoComplete="current-password"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full h-10"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <LoadingSpinner />
              ) : (
                "Se connecter"
              )}
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou
            </span>
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-6 pt-6">
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={(e: React.FormEvent) => {
            e.preventDefault;
            onSubmitOAuth("google");
          }}
        >
          <Icons.Google />
          Continuer avec Google
        </Button>
      </div>
    </div>
  );
}
