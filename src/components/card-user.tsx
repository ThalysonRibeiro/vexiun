"use client"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent } from "./ui/card"

interface CardUserProps {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}


export function CardUser({ user }: { user: CardUserProps }) {
  return (
    <Card key={user.id} className="hover:shadow-lg hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 ease-in-out p-2">
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'Usuário'} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {user.name ?? 'Sem nome'}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}