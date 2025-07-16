import { AuthDefaultLayout } from "@/components/layouts/AuthLayout/AuthDefaultLayout";
import { Toaster } from "@metrica/ui/components/sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthDefaultLayout>
      <Toaster />
      {children}
    </AuthDefaultLayout>
  );
}
