import Image from "next/image";
import { useRouter } from "next/navigation";

import { Database } from "@/types/database";
import { formatDate } from "@/lib/date";

import { TrashProjectDropdown } from "@/components/interfaces/Dashboard/ProjectDropdown";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@metrica/ui/components/table";

export function TrashProjectsList({
  projects,
}: {
  projects: Database["public"]["Tables"]["projects"]["Row"][];
}) {
  const router = useRouter();

  const handleRowClick = (projectId: string) => {
    router.push(`/editor/${projectId}`);
  };

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-[100px] rounded-tl-lg"></TableHead>
          <TableHead className="w-[400px]">Titre</TableHead>
          <TableHead>Dernière modification</TableHead>
          <TableHead>Créé</TableHead>
          <TableHead className="w-[100px] rounded-tr-lg"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow
            key={project.id}
            onClick={() => handleRowClick(project.id)}
            className="cursor-pointer border-none hover:bg-muted"
          >
            <TableCell>
              {project.preview_url ? (
                <Image
                  src={project.preview_url}
                  alt={project.title}
                  width={100}
                  height={150}
                />
              ) : (
                <></>
              )}
            </TableCell>

            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>{formatDate(project.updated_at)}</TableCell>
            <TableCell>{formatDate(project.created_at)}</TableCell>
            <TableCell>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <TrashProjectDropdown project={project} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
