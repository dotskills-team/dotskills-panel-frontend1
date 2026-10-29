"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderSearchProps {
  onClick?: () => void;
}

export function HeaderSearch({ onClick }: HeaderSearchProps) {
  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }
    window.dispatchEvent(new CustomEvent("dotskills:open-command-menu"));
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Search (⌘K)</TooltipContent>
    </Tooltip>
  );
}
