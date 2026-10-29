"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-9 w-9 rounded-lg hover:bg-accent/50"
          title="Search (Ctrl+K)"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}

      {isOpen && (
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (!query) handleClose();
            }}
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
          {query && (
            <button
              onClick={handleClose}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
