"use client";

import { Icons } from "@metrica/ui/components/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { buttonVariants, Button } from "@metrica/ui/components/button";
import { cn } from "@metrica/ui/lib/utils";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div>
          <p className="text-8xl font-semibold text-primary">404</p>
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">
            Page introuvable
          </h1>
          <p className="mt-4 ">
            Nous sommes désolés, la page que vous chercher a bougée ou n'existe
            plus.
          </p>

          <div className="flex items-center mt-6 gap-x-3">
            <Link
              href="/dashboard/projects"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              <span>Vers l'accueil</span>
              <Icons.ArrowRight />
            </Link>
            <Button size="lg" variant="outline" onClick={() => router.back()}>
              Retour en arrière
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
