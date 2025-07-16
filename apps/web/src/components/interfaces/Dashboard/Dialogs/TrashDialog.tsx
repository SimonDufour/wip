"use client";

import { useDashboardStore } from "@/stores/useDashboardStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@metrica/ui/components/dialog";
import { Button } from "@metrica/ui/components/button";

export function TrashDialog() {
  const { trashProject, activeDialog, closeDialog } = useDashboardStore();

  const isDialogOpen = activeDialog?.type === "trash";

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Supprimer le projet?</DialogTitle>
          <DialogDescription>
            Le projet <strong>{activeDialog?.project.title}</strong> sera placé
            dans la corbeille et supprimé définitivement après 30 jours.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              trashProject(activeDialog.project);
              closeDialog();
            }}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
