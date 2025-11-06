"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ArrowUpDown,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { Status, Priority } from "@/generated/prisma";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { colorStatus, colorPriority, statusMap, priorityMap } from "@/utils/colorStatus";
import { useRouter } from "next/navigation";

interface WorkItemsListProps {
  memberId: string;
  workspaceId: string;
  dateRange: string;
}

interface FilterOptions {
  status: string;
  priority: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function WorkItemsList({ memberId, workspaceId, dateRange }: WorkItemsListProps) {
  const router = useRouter();
  const { data: memberItems, isLoading } = useItemsAssociatedWithMember(workspaceId, memberId);
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    priority: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "term",
    sortOrder: "asc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedItems = useMemo(() => {
    if (isLoading || !memberItems) {
      return [];
    }

    const filtered = memberItems.items.filter(item => {
      // Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && item.priority !== filters.priority) {
        return false;
      }

      // Search filter
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && isBefore(item.term, new Date(filters.dateFrom))) {
        return false;
      }
      if (filters.dateTo && isAfter(item.term, new Date(filters.dateTo))) {
        return false;
      }

      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case "term":
          aValue = new Date(a.term).getTime();
          bValue = new Date(b.term).getTime();
          break;
        case "priority":
          const priorityOrder = { [Priority.CRITICAL]: 4, [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1, [Priority.STANDARD]: 0 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "status":
          const statusOrder: Record<Status, number> = { [Status.DONE]: 3, [Status.IN_PROGRESS]: 2, [Status.NOT_STARTED]: 1, [Status.STOPPED]: 0 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        default:
          aValue = new Date(a.term).getTime();
          bValue = new Date(b.term).getTime();
      }

      if (filters.sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [memberItems, filters, isLoading]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage]);

  if (isLoading || !memberItems) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tarefas do Membro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }));
    } else {
      setFilters(prev => ({ ...prev, sortBy: field, sortOrder: "asc" }));
    }
  };

  const getStatusBadge = (status: Status) => {
    const statusInfo = statusMap.find(s => s.key === status);
    return (
      <Badge variant="outline" className={cn("border-transparent", colorStatus(status))}>
        {statusInfo?.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const priorityInfo = priorityMap.find(p => p.key === priority);
    return (
      <Badge variant="outline" className={cn("border-transparent", colorPriority(priority))}>
        {priorityInfo?.label}
      </Badge>
    );
  };

  const isOverdue = (term: string | Date, status: Status) => {
    return status !== Status.DONE && new Date(term) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tarefas do Membro</CardTitle>
          <Badge variant="secondary">
            {filteredAndSortedItems.length} tarefa{filteredAndSortedItems.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, currentPage: 1 }))}
                className="pl-8 w-full md:w-64"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, currentPage: 1 }))}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value={Status.NOT_STARTED}>Não Iniciado</SelectItem>
                <SelectItem value={Status.IN_PROGRESS}>Em Progresso</SelectItem>
                <SelectItem value={Status.DONE}>Concluído</SelectItem>
                <SelectItem value={Status.STOPPED}>Parado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value, currentPage: 1 }))}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas prioridades</SelectItem>
                <SelectItem value={Priority.HIGH}>Alta</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Média</SelectItem>
                <SelectItem value={Priority.LOW}>Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value, currentPage: 1 }))}
              className="w-32"
              placeholder="De"
            />
            <span className="text-muted-foreground">até</span>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value, currentPage: 1 }))}
              className="w-32"
              placeholder="Até"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="h-auto p-0 font-medium"
                  >
                    Tarefa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="h-auto p-0 font-medium"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("priority")}
                    className="h-auto p-0 font-medium"
                  >
                    Prioridade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("term")}
                    className="h-auto p-0 font-medium"
                  >
                    Prazo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhuma tarefa encontrada com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {isOverdue(item.term, item.status) && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="line-clamp-2">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-1",
                        isOverdue(item.term, item.status) && "text-red-600 font-medium"
                      )}>
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.term), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/workspace/${workspaceId}/items/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} até {Math.min(currentPage * itemsPerPage, filteredAndSortedItems.length)} de {filteredAndSortedItems.length} resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}