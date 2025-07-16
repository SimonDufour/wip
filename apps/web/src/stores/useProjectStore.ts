import { Database, Constants } from "@/types/database";
import { User } from "@supabase/supabase-js";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

import { toast } from "sonner";
import { Tab, TabKind } from "@/types/tabs";

export interface ProjectState {
  user: User | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  project: Database["public"]["Tables"]["projects"]["Row"] | null;

  currentTab: Tab;

  sidePanelContent: React.ReactNode | null;
  assistantIsOpen: boolean;
  selectedObject: Object | null;
}

export interface ProjectActions {
  fetchInitial: (projectId: string) => Promise<void>;
  renameProject: (projectName: string) => Promise<void>;

  selectBasemap: (
    basemap: (typeof Constants)["public"]["Enums"]["Basemaps"][number],
  ) => Promise<void>;

  toggleLayer: (
    layer: (typeof Constants)["public"]["Enums"]["Layers"][number],
  ) => Promise<void>;

  selectObject: (object: Object) => void;

  selectTab: (tab: Tab) => void;

  openAssistant: () => void;
  closeAssistant: () => void;

  openSidePanel: (content: React.ReactNode) => void;
  closeSidePanel: () => void;

  clearStateOnSignOut: () => void;
}

const supabase = createClient();

const initialState: ProjectState = {
  user: null,
  profile: null,
  project: null,

  currentTab: { kind: TabKind.Explore, title: "Explorer" },

  sidePanelContent: null,
  assistantIsOpen: false,
  selectedObject: null,
};

export const useProjectStore = create<ProjectState & ProjectActions>()(
  (set, get) => ({
    ...initialState,

    fetchInitial: async (projectId) => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          get().clearStateOnSignOut();
          return;
        }

        const [profileResult, projectResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("projects").select("*").eq("id", projectId).single(),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (projectResult.error) throw projectResult.error;

        set({
          user: user,
          profile: profileResult.data,
          project: projectResult.data,
        });
      } catch (error: any) {
        console.error(
          "Échec de la récupération des données du tableau de bord",
          error.message,
        );
        toast.error("Échec de la récupération des données du tableau de bord");
        get().clearStateOnSignOut();
      }
    },

    renameProject: async (projectTitle: string) => {
      const project = get().project;

      if (!project) return;

      const originalTitle: string | null = project.title;
      const now = new Date().toISOString();

      set((state) => ({
        project: { ...project, title: projectTitle, updated_at: now },
      }));

      try {
        const { error } = await supabase
          .from("projects")
          .update({ title: projectTitle, updated_at: now })
          .eq("id", project.id);

        if (error) throw error;
      } catch (error: any) {
        set({
          project: { ...project, title: originalTitle },
        });
        toast.error("Erreur lors du renommage du projet");
        console.error("Error renaming project:", error.message);
      }
    },

    selectBasemap: async (basemap) => {
      const project = get().project;
      if (!project) return;

      set((state) => ({
        project: { ...project, basemap: basemap },
      }));

      try {
        const { error } = await supabase
          .from("projects")
          .update({ basemap: basemap })
          .eq("id", project.id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Échec du chargement de la carte", error.message);
        toast.error("Échec du chargement de la carte");
        get().clearStateOnSignOut();
      }
    },

    toggleLayer: async (layer) => {
      const project = get().project;

      if (!project) return;

      const originalLayers = project.layers ?? [];

      const isActive = originalLayers.includes(layer);

      const updatedLayers = isActive
        ? originalLayers.filter((l) => l !== layer)
        : [...originalLayers, layer];

      set({
        project: { ...project, layers: updatedLayers },
      });

      try {
        const { error } = await supabase
          .from("projects")
          .update({ layers: updatedLayers })
          .eq("id", project.id);

        if (error) {
          throw error;
        }
      } catch (error: any) {
        console.error(
          "Échec de la mise à jour des couches du projet",
          error.message,
        );
        toast.error("Échec de la mise à jour des couches");

        set({
          project: { ...project, layers: originalLayers },
        });
      }
    },

    selectObject: (object) => {
      set({ selectedObject: object });
    },

    selectTab: (tab) => {
      set({ currentTab: tab });
    },

    openAssistant: () => {
      set({ assistantIsOpen: true });
    },

    openSidePanel: (content) => {
      set({ sidePanelContent: content });
    },

    closeAssistant: () => {
      set({ assistantIsOpen: false });
    },

    closeSidePanel: () => {
      set({ sidePanelContent: null });
    },

    clearStateOnSignOut: () => {
      set(initialState);
    },
  }),
);
