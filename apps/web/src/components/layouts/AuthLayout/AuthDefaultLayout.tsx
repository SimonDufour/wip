import Link from "next/link";

import { Icons } from "@metrica/ui/components/icons";

export function AuthDefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 lg:p-10">
          <div className="flex justify-center gap-2 lg:justify-start">
            <Link
              href="#"
              className="flex items-center gap-2 font-medium text-2xl"
            >
              Metrica
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>

          <Link
            href="/terms-and-conditions"
            className="flex items-center gap-2 underline text-sm"
          >
            <Icons.Info size={15} />
            Terms and conditions
          </Link>
        </div>

        <div className="bg-primary hidden lg:block" />
      </div>
    </section>
  );
}
