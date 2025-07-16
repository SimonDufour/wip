"use client";

import { useDashboardStore } from "@/stores/useDashboardStore";

import { Icons } from "@metrica/ui/components/icons";
import { Button } from "@metrica/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@metrica/ui/components/dialog";

export function TrashPanelHero() {
  const { emptyTrash } = useDashboardStore();

  return (
    <div className="bg-card border min-h-20 rounded w-full flex flex-col items-start p-4 gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm ">Les projets seront supprimés après 30 jours.</p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Icons.Delete />
            Vider la corbeille
          </Button>
        </DialogTrigger>
        <DialogContent className=" [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Vider la corbeille</DialogTitle>
            <DialogDescription>
              Supprimer définitivement le contenu de la corbeille?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  emptyTrash();
                }}
              >
                Confirmer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
