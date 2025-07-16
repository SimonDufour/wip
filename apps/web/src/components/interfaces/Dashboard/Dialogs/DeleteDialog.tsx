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

export function DeleteDialog() {
  const { deleteProject, activeDialog, closeDialog } = useDashboardStore();

  const isDialogOpen = activeDialog?.type === "delete";

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Supprimer le projet?</DialogTitle>
          <DialogDescription>
            Le projet <strong>{activeDialog?.project.title}</strong> sera
            supprimé définitivement.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteProject(activeDialog.project.id);
              closeDialog();
            }}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
