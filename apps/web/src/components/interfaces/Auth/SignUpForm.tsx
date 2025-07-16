import Link from "next/link";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signUpFormSchema } from "@/lib/validationSchemas";

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
import { Provider } from "@supabase/supabase-js";
import { LoadingSpinner } from "@metrica/ui/components/loading-spinner";
import { createClient } from "@/lib/supabase/client";

const formSchema = signUpFormSchema;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
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
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/projects`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      console.error("Form submission error", error);
      toast.error("Échec de la soumission. Veuillez réessayer.");
    }
  }

  async function onSubmitOAuth(provider: Provider) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) throw error;
      router.push("/dashboard/projects");
    } catch (error: unknown) {
      console.error("Form submission error", error);
      toast.error("Échec de la soumission. Veuillez réessayer.");
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Bienvenue sur Metrica</h1>
        <p>Essayez maintenant - c'est gratuit.</p>
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
                <FormLabel htmlFor="password">Mot de passe</FormLabel>
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
          <Button type="submit" className="w-full h-10">
            {form.formState.isSubmitting ? <LoadingSpinner /> : "Se connecter"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou
            </span>
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-3 pt-6">
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={() => onSubmitOAuth("google")}
        >
          <Icons.Google />
          Continuer avec Google
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Déjà un compte? </span>
          <Link
            href="/auth/login"
            className="underline underline-offset-4 text-primary font-medium"
          >
            Connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
