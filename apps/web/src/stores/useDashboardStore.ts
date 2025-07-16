import { Database } from "@/types/database";
import { User } from "@supabase/supabase-js";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

import { toast } from "sonner";

export interface DashboardState {
  user: User | null;
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  projects: Database["public"]["Tables"]["projects"]["Row"][];
  trashProjects: Database["public"]["Tables"]["trash"]["Row"][];
  activeDialog: {
    type: "rename" | "trash" | "delete";
    project:
      | Database["public"]["Tables"]["projects"]["Row"]
      | Database["public"]["Tables"]["trash"]["Row"];
  } | null;
}

export interface DashboardActions {
  fetchInitial: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  createProject: (projectTitle: string) => Promise<string | undefined>;
  renameProject: (projectTitle: string, projectId: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;

  trashProject: (
    project: Database["public"]["Tables"]["projects"]["Row"],
  ) => Promise<void>;
  unTrashProject: (
    trashProject: Database["public"]["Tables"]["trash"]["Row"],
  ) => Promise<void>;
  emptyTrash: () => Promise<void>;

  openRenameDialog: (
    project: Database["public"]["Tables"]["projects"]["Row"],
  ) => void;
  openTrashDialog: (
    project: Database["public"]["Tables"]["projects"]["Row"],
  ) => void;
  openDeleteDialog: (
    project: Database["public"]["Tables"]["projects"]["Row"],
  ) => void;
  closeDialog: () => void;

  clearStateOnSignOut: () => void;
}

const supabase = createClient();

const initialState: DashboardState = {
  user: null,
  profile: null,
  projects: [],
  trashProjects: [],
  activeDialog: null,
};

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  (set, get) => ({
    ...initialState,

    fetchInitial: async () => {
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

        const [profileResult, projectsResult, trashResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("trash")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (projectsResult.error) throw projectsResult.error;
        if (trashResult.error) throw trashResult.error;

        set({
          user: user,
          profile: profileResult.data,
          projects: projectsResult.data || [],
          trashProjects: trashResult.data || [],
        });
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error.message);
        toast.error("Échec du chargement des données");
        get().clearStateOnSignOut();
      }
    },

    fetchProjects: async () => {
      const user = get().user;
      if (!user) return;

      try {
        const [projectsResult, trashResult] = await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("trash")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        const { data: projects, error: projectsError } = projectsResult;
        const { data: trashProjects, error: trashError } = trashResult;

        if (projectsError) throw projectsError;
        if (trashError) throw trashError;

        set({
          projects: projects || [],
          trashProjects: trashProjects || [],
        });
      } catch (error: any) {
        console.error("Error fetching projects:", error.message);
        toast.error("Échec du chargement des données");
      }
    },

    clearStateOnSignOut: () => {
      set(initialState);
    },

    createProject: async (
      projectTitle: string,
    ): Promise<string | undefined> => {
      const user = get().user;
      if (!user) return;

      try {
        const { data: newProject, error } = await supabase
          .from("projects")
          .insert({ title: projectTitle, user_id: user.id })
          .select()
          .single();

        if (error) throw error;

        if (newProject) {
          set((state) => ({
            projects: [newProject, ...state.projects],
          }));
        }

        return newProject?.id;
      } catch (error: any) {
        console.error("Error creating project:", error.message);
        toast.error("Échec de la création du projet");
      }
    },

    renameProject: async (projectTitle: string, projectId: string) => {
      const now = new Date().toISOString();

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? { ...project, title: projectTitle, updated_at: now }
            : project,
        ),
      }));

      try {
        const { error } = await supabase
          .from("projects")
          .update({ title: projectTitle, updated_at: now })
          .eq("id", projectId);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error renaming project:", error.message);
        toast.error("Erreur: Le projet n'a pa pu être renommer");
        get().fetchProjects();
      }
    },

    trashProject: async (
      project: Database["public"]["Tables"]["projects"]["Row"],
    ) => {
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== project.id),
        trashProjects: [
          { ...project, trashed_at: new Date().toISOString() },
          ...state.trashProjects,
        ],
      }));

      try {
        const { error: insertError } = await supabase
          .from("trash")
          .insert(project);

        if (insertError) throw insertError;

        const { error: deleteError } = await supabase
          .from("projects")
          .delete()
          .eq("id", project.id);

        if (deleteError) throw deleteError;
      } catch (error: any) {
        console.error("Error trashing project:", error.message);
        toast.error("Erreur lors de la mise à la corbeille du projet");
        get().fetchProjects();
      }
    },

    unTrashProject: async (
      trashProject: Database["public"]["Tables"]["trash"]["Row"],
    ) => {
      const { trashed_at, ...projectToRestore } = trashProject;

      set((state) => ({
        trashProjects: state.trashProjects.filter(
          (p) => p.id !== trashProject.id,
        ),
        projects: [projectToRestore, ...state.projects],
      }));

      try {
        const { error: insertError } = await supabase
          .from("projects")
          .insert(projectToRestore);

        if (insertError) throw insertError;

        const { error: deleteError } = await supabase
          .from("trash")
          .delete()
          .eq("id", trashProject.id);

        if (deleteError) throw deleteError;
      } catch (error: any) {
        console.error("Error restoring project:", error.message);
        toast.error("Impossible de restaurer le projet");
        get().fetchProjects();
      }
    },

    deleteProject: async (projectId: string) => {
      set((state) => ({
        trashProjects: state.trashProjects.filter((p) => p.id !== projectId),
      }));

      try {
        const { error } = await supabase
          .from("trash")
          .delete()
          .eq("id", projectId);

        if (error) throw error;
      } catch (error: any) {
        toast.error("Impossible de supprimer le projet");
        console.error("Error deleting project:", error.message);
        get().fetchProjects();
      }
    },

    emptyTrash: async () => {
      set((state) => ({ trashProjects: [] }));

      const user = get().user;
      if (!user) return;

      try {
        const { error } = await supabase
          .from("trash")
          .delete()
          .eq("user_id", user.id);
      } catch (error: any) {
        toast.error("Impossible de supprimer les projets");
        console.error("Error deleting projects:", error.message);
        get().fetchProjects();
      }
    },

    openRenameDialog: (project) =>
      set({
        activeDialog: { type: "rename", project: project },
      }),

    openTrashDialog: (project) =>
      set({
        activeDialog: { type: "trash", project: project },
      }),

    openDeleteDialog: (project) =>
      set({
        activeDialog: { type: "delete", project: project },
      }),

    closeDialog: () =>
      set({
        activeDialog: null,
      }),
  }),
);
