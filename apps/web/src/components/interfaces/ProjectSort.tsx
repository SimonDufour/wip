import { Database } from "@/types/database";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@metrica/ui/components/select";

export type SortType = "name" | "updated" | "created";

export function sortBy(
  sortType: SortType,
  projects: Database["public"]["Tables"]["projects"]["Row"][],
): Database["public"]["Tables"]["projects"]["Row"][] {
  if (!projects) return [];

  return projects.sort((a, b) => {
    if (sortType === "updated") {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    if (sortType === "created") {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    if (sortType === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
}

export function ProjectSortDropdown({
  value,
  onValueChange,
}: {
  value: SortType;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="border-0 shadow-none p-0 bg-background">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name">Par titre</SelectItem>
        <SelectItem value="updated">Dernière modification</SelectItem>
        <SelectItem value="created">Date de création</SelectItem>
      </SelectContent>
    </Select>
  );
}
