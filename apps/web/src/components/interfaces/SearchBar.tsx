import { Icons } from "@metrica/ui/components/icons";
import * as React from "react";
import { Button } from "@metrica/ui/components/button";
import { Input } from "@metrica/ui/components/input";
import { cn } from "@metrica/ui/lib/utils";

interface SearchbarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showButton?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  className,
  showButton = false,
  size = "md",
}: SearchbarProps) {
  const [query, setQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10",
    lg: "h-12 text-lg",
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative flex items-center", className)}
    >
      <div className="relative flex-1">
        <Icons.Search
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
          )}
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "pl-10 pr-10",
            sizeClasses[size],
            showButton && "rounded-r-none border-r-0",
          )}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent",
              size === "sm" && "h-5 w-5",
              size === "lg" && "h-8 w-8",
            )}
          >
            <Icons.Cancel
              className={cn(
                "text-muted-foreground hover:text-foreground",
                size === "sm"
                  ? "h-3 w-3"
                  : size === "lg"
                    ? "h-5 w-5"
                    : "h-4 w-4",
              )}
            />
          </Button>
        )}
      </div>
      {showButton && (
        <Button
          type="submit"
          className={cn("rounded-l-none", sizeClasses[size])}
        >
          Search
        </Button>
      )}
    </form>
  );
}
