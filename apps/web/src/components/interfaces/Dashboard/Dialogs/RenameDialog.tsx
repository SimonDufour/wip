"use client";

import { useState, useEffect } from "react";
import { z } from "zod";

import { useDashboardStore } from "@/stores/useDashboardStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@metrica/ui/components/dialog";
import { Button } from "@metrica/ui/components/button";
import { Input } from "@metrica/ui/components/input";
import { Label } from "@metrica/ui/components/label";

const renameSchema = z.object({
  name: z
    .string()
    .min(1, "Nom invalide")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
});

export function RenameDialog() {
  const { renameProject, activeDialog, closeDialog } = useDashboardStore();

  const [name, setName] = useState("");

  const isDialogOpen = activeDialog?.type === "rename";

  useEffect(() => {
    if (activeDialog?.project.title) {
      setName(activeDialog.project.title);
    }
  }, [activeDialog?.project]);

  const handleRename = () => {
    if (activeDialog?.project) {
      renameProject(name, activeDialog.project.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = renameSchema.safeParse({ name });

    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    handleRename();
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent className="[&>button]:hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Renommer le projet</DialogTitle>
          </DialogHeader>

          <div>
            <Label htmlFor="projectName" className="py-2">
              Nom du projet
            </Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Annuler
            </Button>
            <Button type="submit">Confirmer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
