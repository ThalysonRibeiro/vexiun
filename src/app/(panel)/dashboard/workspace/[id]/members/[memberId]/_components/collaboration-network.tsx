"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GitBranch, 
  MessageSquare, 
  Share2,
  Target,
  TrendingUp,
  UserPlus,
  Link2
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CollaborationNetworkProps {
  memberId: string;
  workspaceId: string;
  detailed?: boolean;
}

interface CollaboratorData {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  collaborationScore: number;
  sharedItems: number;
  interactions: number;
  lastInteraction: string;
}

interface TeamMember {
  userId: string;
  name?: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Mock collaboration data generator
const generateMockCollaborators = (currentMemberId: string, teamMembers: TeamMember[]): CollaboratorData[] => {
  return teamMembers
    .filter(member => member.userId !== currentMemberId)
    .map(member => ({
      userId: member.userId,
      name: member.name || member.email.split('@')[0],
      email: member.email,
      avatar: member.avatar,
      role: member.role || "Membro",
      collaborationScore: Math.floor(Math.random() * 100) + 1,
      sharedItems: Math.floor(Math.random() * 15) + 1,
      interactions: Math.floor(Math.random() * 50) + 5,
      lastInteraction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
    .sort((a, b) => b.collaborationScore - a.collaborationScore)
    .slice(0, 8); // Top 8 collaborators
};

export function CollaborationNetwork({ memberId, workspaceId }: CollaborationNetworkProps) {
  const { data: teamData } = useTeam(workspaceId);
  const { data: memberItems } = useItemsAssociatedWithMember(workspaceId, memberId);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null);

  if (!teamData || teamData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rede de Colaboração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Nenhum colaborador disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  const collaborators = generateMockCollaborators(memberId, teamData.map(member => ({
    userId: member.user.id,
    name: member.user.name || undefined,
    email: member.user.email,
    avatar: member.user.image || undefined,
    role: member.role
  })));
  const currentMember = teamData.find(member => member.user.id === memberId);

  const getCollaborationLevel = (score: number) => {
    if (score >= 80) return { level: "Alta", color: "text-green-600 bg-green-100" };
    if (score >= 60) return { level: "Média", color: "text-yellow-600 bg-yellow-100" };
    return { level: "Baixa", color: "text-red-600 bg-red-100" };
  };

  const getInteractionType = (type: string) => {
    switch (type) {
      case "task": return { icon: Target, color: "text-blue-500", label: "Tarefas Compartilhadas" };
      case "comment": return { icon: MessageSquare, color: "text-purple-500", label: "Comentários" };
      case "review": return { icon: GitBranch, color: "text-green-500", label: "Revisões" };
      default: return { icon: Share2, color: "text-gray-500", label: "Interações" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Collaboration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rede de Colaboração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{collaborators.length}</div>
              <div className="text-sm text-blue-700">Colaboradores Ativos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {collaborators.reduce((acc, collab) => acc + collab.sharedItems, 0)}
              </div>
              <div className="text-sm text-green-700">Itens Compartilhados</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {collaborators.reduce((acc, collab) => acc + collab.interactions, 0)}
              </div>
              <div className="text-sm text-purple-700">Total de Interações</div>
            </div>
          </div>

          {/* Top Collaborators */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Principais Colaboradores
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborators.map((collaborator) => {
                const collaboration = getCollaborationLevel(collaborator.collaborationScore);
                const isSelected = selectedCollaborator === collaborator.userId;
                
                return (
                  <div
                    key={collaborator.userId}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedCollaborator(isSelected ? null : collaborator.userId)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {collaborator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{collaborator.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{collaborator.role}</div>
                      </div>
                      <Badge className={cn("text-xs", collaboration.color)}>
                        {collaboration.level}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-semibold">{collaborator.sharedItems}</div>
                        <div className="text-xs text-muted-foreground">Itens</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-semibold">{collaborator.interactions}</div>
                        <div className="text-xs text-muted-foreground">Interações</div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Última interação:</span>
                          <span className="font-medium">
                            {new Date(collaborator.lastInteraction).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Score de colaboração:</span>
                          <span className="font-bold">{collaborator.collaborationScore}/100</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Network Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Mapa de Colaboração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Central Node - Current Member */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Avatar className="h-16 w-16 border-4 border-primary">
                  <AvatarImage src={currentMember?.user.image || undefined} alt={currentMember?.user.name || currentMember?.user.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {currentMember?.user.name?.charAt(0).toUpperCase() || currentMember?.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                  Você
                </div>
              </div>
            </div>

            {/* Connected Nodes - Collaborators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collaborators.slice(0, 8).map((collaborator, index) => {
                const angle = (index * 45) - 90; // Spread collaborators in a circle
                const distance = 120;
                const collaboration = getCollaborationLevel(collaborator.collaborationScore);
                
                return (
                  <div key={collaborator.userId} className="text-center">
                    <div className="relative inline-block">
                      <Avatar className={cn(
                        "h-12 w-12 border-2",
                        collaboration.level === "Alta" ? "border-green-500" :
                        collaboration.level === "Média" ? "border-yellow-500" :
                        "border-red-500"
                      )}>
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {collaborator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center",
                        collaboration.level === "Alta" ? "bg-green-500 text-white" :
                        collaboration.level === "Média" ? "bg-yellow-500 text-white" :
                        "bg-red-500 text-white"
                      )}>
                        {collaborator.collaborationScore}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium truncate">{collaborator.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{collaborator.role}</div>
                      <div className="text-xs text-muted-foreground">
                        {collaborator.sharedItems} itens
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connection Lines Visualization */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Lines connecting to center */}
                {collaborators.slice(0, 8).map((_, index) => {
                  const startX = 200;
                  const startY = 100;
                  const angle = (index * 45) - 90;
                  const distance = 80;
                  const endX = startX + Math.cos((angle * Math.PI) / 180) * distance;
                  const endY = startY + Math.sin((angle * Math.PI) / 180) * distance;
                  
                  return (
                    <line
                      key={index}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Collaboration Insights */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights de Colaboração
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Colaboração mais forte com <strong>{collaborators[0]?.name}</strong> ({collaborators[0]?.collaborationScore}/100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Total de <strong>{collaborators.reduce((acc, c) => acc + c.sharedItems, 0)} itens</strong> compartilhados com a equipe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Média de <strong>{Math.round(collaborators.reduce((acc, c) => acc + c.interactions, 0) / collaborators.length)} interações</strong> por colaborador</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}