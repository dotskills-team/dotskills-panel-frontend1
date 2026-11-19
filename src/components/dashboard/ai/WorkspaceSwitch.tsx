"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AI_WORKSPACE_LABELS,
  type AiWorkspace,
} from "@/features/ai/constants/ai.constants";

interface WorkspaceSwitchProps {
  value: AiWorkspace;
  onChange: (workspace: AiWorkspace) => void;
  /** Personal is only offered to admin roles. */
  showPersonal: boolean;
}

export function WorkspaceSwitch({ value, onChange, showPersonal }: WorkspaceSwitchProps) {
  // Non-admins have a single workspace, so there is nothing to switch.
  if (!showPersonal) return null;

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as AiWorkspace)}>
      <TabsList className="w-full">
        <TabsTrigger value="business">{AI_WORKSPACE_LABELS.business}</TabsTrigger>
        <TabsTrigger value="personal">{AI_WORKSPACE_LABELS.personal}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
