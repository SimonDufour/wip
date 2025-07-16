import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@metrica/ui/components/card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Désolé, une erreur est survenue</h1>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">Erreur: {params.error}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Erreur inconnue.</p>
      )}
    </div>
  );
}
