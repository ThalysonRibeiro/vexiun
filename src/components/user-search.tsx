"use client";
import { useDebounce } from "@/hooks/use-debounce";
import { Check, Search, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { nameFallback } from "@/utils/name-fallback";
import { useUserSearch } from "@/hooks/use-user";

interface UserSearchProps {
  theResults: (users: UserSearchType[]) => void;
  excludeUserIds?: string[];
  titleVisible?: boolean;
  placeholder?: string;
  maxUsers?: number;
  showSelectedCount?: boolean;
  customTitle?: string;
}

type UserSearchType = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export interface UserSearchRef {
  reset: () => void;
}

export const UserSearch = forwardRef<UserSearchRef, UserSearchProps>(
  (
    {
      theResults,
      excludeUserIds = [],
      titleVisible = false,
      placeholder = "Buscar por nome ou email...",
      maxUsers,
      showSelectedCount = false,
      customTitle = "Convide usuários para criar sua equipe de trabalho!"
    },
    ref
  ) => {
    const [query, setQuery] = useState<string>("");
    const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
    const debouncedQuery = useDebounce(query, 300);

    // ✅ Passa excludeUserIds diretamente pro hook
    const { data: users = [], isLoading } = useUserSearch(debouncedQuery, excludeUserIds);

    useEffect(() => {
      theResults(selectedUsers);
    }, [selectedUsers, theResults]);

    const isReset = () => {
      setSelectedUsers([]);
      setQuery("");
    };

    useImperativeHandle(ref, () => ({
      reset: isReset
    }));

    const toggleUser = (user: UserSearchType) => {
      setSelectedUsers((prev) => {
        const exists = prev.find((u) => u.id === user.id);
        if (exists) {
          return prev.filter((u) => u.id !== user.id);
        }

        if (maxUsers && prev.length >= maxUsers) {
          return prev;
        }

        return [...prev, user];
      });
    };

    const isSelected = (userId: string) => selectedUsers.some((u) => u.id === userId);

    return (
      <div className="space-y-4">
        {titleVisible && <h3>{customTitle}</h3>}
        {showSelectedCount && <p>{selectedUsers.length} selecionados</p>}

        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10" // ✅ Espaço para o ícone
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 bg-gradient-to-br from-primary to-orange-500 text-white px-3 py-1 rounded-full"
              >
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={() => toggleUser(user)}
                  className="hover:text-zinc-800 transition-colors"
                  aria-label={`Remover ${user.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {isLoading && <div className="p-4 text-center text-gray-500">Buscando...</div>}

          {!isLoading && users.length === 0 && query.trim().length >= 2 && (
            <div className="p-4 text-center text-gray-500">Nenhum usuário encontrado</div>
          )}

          {!isLoading &&
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUser(user)}
                className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors ${isSelected(user.id) ? "bg-accent" : ""}`}
              >
                <Avatar>
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>{nameFallback(user.name || user.email)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs truncate text-muted-foreground">{user.email}</p>
                </div>

                {isSelected(user.id) && <Check className="w-5 h-5 text-green-500 flex-shrink-0" />}
              </div>
            ))}
        </div>
      </div>
    );
  }
);

UserSearch.displayName = "UserSearch";
