import { Button } from "@metrica/ui/components/button";
import { Icons } from "@metrica/ui/components/icons";
import { useSidebar } from "@metrica/ui/components/sidebar";

const MobileNavigationBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="h-12 flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <Icons.Logo size={30} className="shrink-0 text-primary" />
        <span className="whitespace-nowrap text-xl font-bold text-primary">
          Metrica
        </span>
      </div>
      <Button variant="ghost" onClick={toggleSidebar}>
        <Icons.Menu className="h-40 w-40" />
      </Button>
    </header>
  );
};

export default MobileNavigationBar;
