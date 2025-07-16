export default function SignUpSuccessPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-medium">Vérifier votre courriel</h1>
        <p className="text-sm text-muted-foreground">
          Votre inscription a été effectuée avec succès. Veuillez vérifier votre
          courriel pour confirmer votre compte avant de vous connecter.
        </p>
      </div>
    </div>
  );
}
