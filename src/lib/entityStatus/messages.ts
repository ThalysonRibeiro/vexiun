import { EntityStatus } from "@/generated/prisma";

export const entityStatusMessages = {
  WORKSPACE: (type: EntityStatus) => {
    switch (type) {
      case "ACTIVE":
        return "Workspace arquivada com sucesso";
      case "ARCHIVED":
        return "Workspace restaurada com sucesso";
      case "DELETED":
        return "Workspace movida para lixeira";
    }
  },
  GROUPE: (type: EntityStatus) => {
    switch (type) {
      case "ACTIVE":
        return "Grupo arquivada com sucesso";
      case "ARCHIVED":
        return "Grupo restaurada com sucesso";
      case "DELETED":
        return "Grupo movida para lixeira";
    }
  },
  ITEM: (type: EntityStatus) => {
    switch (type) {
      case "ACTIVE":
        return "Item arquivada com sucesso";
      case "ARCHIVED":
        return "Item restaurada com sucesso";
      case "DELETED":
        return "Item movida para lixeira";
    }
  }
};
