"use client";

import { cn } from "@/lib/utils";
import { ChevronUp, Plus } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

const UTILITY_BUTTON_ITEM_TYPE = Symbol("UtilityButtonItem");

interface UtilityButtonItemProps {
  children: ReactNode;
  icon?: ReactNode;
  delay?: 0 | 75 | 150;
  onClick?: () => void;
  isOpen?: boolean;
  [UTILITY_BUTTON_ITEM_TYPE]?: true;
}

export function UtilityButtonItem({
  children,
  icon = <Plus className="w-4 h-4" />,
  delay = 75,
  onClick,
  isOpen = true
}: UtilityButtonItemProps) {
  const delayClass = {
    0: "delay-0",
    75: "delay-75",
    150: "delay-150"
  }[delay];

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer group/item flex items-center gap-2 bg-gradient-to-tr from-primary to-orange-500 text-white rounded-full shadow-lg active:shadow-md overflow-hidden pointer-events-auto",
        "transition-all duration-300 ease-out",
        delayClass,
        "h-12 pl-4 pr-4 min-w-12",
        "hover:shadow-xl hover:scale-105",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}
    >
      <span className="font-medium text-sm whitespace-nowrap">{children}</span>
      <div className="flex-shrink-0">{icon}</div>
    </div>
  );
}

type UtilityButtonChildren =
  | ReactElement<UtilityButtonItemProps>
  | ReactElement<UtilityButtonItemProps>[];

interface UtilityButtonProps {
  children: UtilityButtonChildren;
}

export default function UtilityButton({ children }: UtilityButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);

    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const validateChildren = (child: ReactNode) => {
        if (!isValidElement(child)) return false;

        return child.type === UtilityButtonItem;
      };

      const childArray = Array.isArray(children) ? children : [children];
      const allValid = childArray.every(validateChildren);

      if (!allValid) {
        console.error("UtilityButton: Todos os children devem ser componentes UtilityButtonItem");
      }
    }
  }, [children]);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as ReactElement<UtilityButtonItemProps>, { isOpen });
    }
    return child;
  });

  return (
    <div ref={ref} className="fixed right-5 bottom-5 z-50">
      <div className="relative">
        <div className="absolute bottom-20 right-0 flex flex-col items-end gap-3 pointer-events-none">
          {childrenWithProps}
        </div>

        <button
          className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center cursor-pointer shadow-xl",
            "active:scale-95 transition-all duration-300 ease-out relative",
            "hover:scale-110"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Plus
            className={cn(
              "w-6 h-6 text-white absolute transition-all duration-300",
              isOpen ? "rotate-[135deg]" : "rotate-0 opacity-100"
            )}
          />
        </button>
      </div>
    </div>
  );
}

UtilityButtonItem.displayName = "UtilityButtonItem";
UtilityButton.displayName = "UtilityButton";

/*
// ============================================
// UTILITY BUTTON - EXEMPLO DE USO
// ============================================

import UtilityButton, { UtilityButtonItem } from "@/components/ui/utility-button"
import { Plus, Settings, User, Bell, FileText, MessageSquare } from "lucide-react"

// ============================================
// EXEMPLO BÁSICO
// ============================================

export function BasicExample() {
  return (
    <UtilityButton>
      <UtilityButtonItem
        delay={0}
        onClick={() => console.log('Item 1')}
        icon={<Plus className="w-4 h-4" />}
      >
        Adicionar
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={75}
        onClick={() => console.log('Item 2')}
        icon={<Settings className="w-4 h-4" />}
      >
        Configurações
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={150}
        onClick={() => console.log('Item 3')}
        icon={<User className="w-4 h-4" />}
      >
        Perfil
      </UtilityButtonItem>
    </UtilityButton>
  )
}

// ============================================
// EXEMPLO COM DIALOG (shadcn/ui)
// ============================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

type DialogType = 'profile' | 'settings' | 'notifications';

export function DialogExample() {
  const [openDialog, setOpenDialog] = useState<DialogType | null>(null);

  return (
    <>
      <UtilityButton>
        <UtilityButtonItem
          delay={0}
          onClick={() => setOpenDialog('profile')}
          icon={<User className="w-4 h-4" />}
        >
          Perfil
        </UtilityButtonItem>

        <UtilityButtonItem
          delay={75}
          onClick={() => setOpenDialog('settings')}
          icon={<Settings className="w-4 h-4" />}
        >
          Configurações
        </UtilityButtonItem>

        <UtilityButtonItem
          delay={150}
          onClick={() => setOpenDialog('notifications')}
          icon={<Bell className="w-4 h-4" />}
        >
          Notificações
        </UtilityButtonItem>
      </UtilityButton>

      <Dialog open={openDialog === 'profile'} onOpenChange={(open) => setOpenDialog(open ? 'profile' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil do Usuário</DialogTitle>
          </DialogHeader>
          <p>Conteúdo do perfil aqui...</p>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'settings'} onOpenChange={(open) => setOpenDialog(open ? 'settings' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações</DialogTitle>
          </DialogHeader>
          <p>Configurações aqui...</p>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'notifications'} onOpenChange={(open) => setOpenDialog(open ? 'notifications' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          <p>Notificações aqui...</p>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ============================================
// EXEMPLO COM NAVEGAÇÃO (Next.js)
// ============================================

import { useRouter } from "next/navigation"

export function NavigationExample() {
  const router = useRouter();

  return (
    <UtilityButton>
      <UtilityButtonItem
        delay={0}
        onClick={() => router.push('/new-post')}
        icon={<FileText className="w-4 h-4" />}
      >
        Nova Publicação
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={75}
        onClick={() => router.push('/messages')}
        icon={<MessageSquare className="w-4 h-4" />}
      >
        Mensagens
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={150}
        onClick={() => router.push('/profile')}
        icon={<User className="w-4 h-4" />}
      >
        Meu Perfil
      </UtilityButtonItem>
    </UtilityButton>
  )
}

// ============================================
// EXEMPLO COM AÇÕES DIRETAS
// ============================================

export function ActionsExample() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Compartilhar',
        text: 'Confira isso!',
        url: window.location.href,
      });
    }
  };

  const handleDownload = () => {
    // Lógica de download
    console.log('Download iniciado');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <UtilityButton>
      <UtilityButtonItem
        delay={0}
        onClick={handleShare}
        icon={<Plus className="w-4 h-4" />}
      >
        Compartilhar
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={75}
        onClick={handleDownload}
        icon={<Plus className="w-4 h-4" />}
      >
        Download
      </UtilityButtonItem>

      <UtilityButtonItem
        delay={150}
        onClick={handlePrint}
        icon={<Plus className="w-4 h-4" />}
      >
        Imprimir
      </UtilityButtonItem>
    </UtilityButton>
  )
}

// ============================================
// PROPS DISPONÍVEIS
// ============================================

/*
UtilityButtonItem Props:
├── children: ReactNode (obrigatório)
│   └── Texto ou conteúdo do botão
│
├── icon?: ReactNode
│   └── Ícone a ser exibido (padrão: Plus icon)
│
├── delay?: 0 | 75 | 150
│   └── Delay da animação em ms (padrão: 75)
│   └── Use 0 para primeiro, 75 para segundo, 150 para terceiro
│
└── onClick?: () => void
    └── Função executada ao clicar no item

DICAS:
• Máximo recomendado: 3-5 itens
• Use delays em sequência (0, 75, 150) para efeito cascata
• O botão é fixo no canto inferior direito
• Funciona em mobile e Workspace
• Fecha automaticamente ao clicar fora
*/
