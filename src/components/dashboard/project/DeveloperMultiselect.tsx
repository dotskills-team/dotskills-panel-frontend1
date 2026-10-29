// src/features/projects/components/developer-multi-select.tsx
"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getUserFullName } from "@/features/users/utils/user.utils";

interface UserOption {
  _id: string;
  firstName: string;
  lastName: string;
}

interface DeveloperMultiSelectProps {
  users: UserOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function DeveloperMultiSelect({
  users,
  value,
  onChange,
  placeholder = "Select developers",
}: DeveloperMultiSelectProps) {
  const selectedUsers = users.filter((user) => value.includes(user._id));

  const toggleUser = (id: string) => {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  };

  const removeUser = (id: string) => {
    onChange(value.filter((item) => item !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="h-auto min-h-9 w-full justify-between font-normal"
        >
          <div className="flex flex-wrap gap-1">
            {selectedUsers.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedUsers.map((user) => (
                <Badge
                  key={user._id}
                  variant="secondary"
                  className="gap-1"
                  onClick={(event) => event.stopPropagation()}
                >
                  {getUserFullName(user)}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeUser(user._id);
                    }}
                    className="rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search developers..." />
          <CommandList>
            <CommandEmpty>No developers found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user._id}
                  value={getUserFullName(user)}
                  onSelect={() => toggleUser(user._id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(user._id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {getUserFullName(user)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}