import { TeamResponse } from "@/hooks/use-team";
import { JSONContent } from "@tiptap/core";

export type TeamUser = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
};

export type EditingField = "title" | "notes" | "description" | "term" | null;

export interface EditingState {
  itemId: string | null;
  field: EditingField;
}

export interface DialogStateProps {
  isOpen: boolean;
  itemId: string | null;
  isEditing: boolean;
  content: JSONContent | null;
}

export interface ItemsTablesProps {
  groupId: string;
  team: TeamResponse;
  changeLayout: boolean;
  workspaceId: string;
}
