import Image from "next/image";

import { Plus } from "lucide-react";
import letStart from "@/assets/illustration_lets-start.png";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EmptyGoal() {
  return (
    <>
      <div className="h-[90vh] flex items-center justify-center flex-col gap-8">
        <Image alt="imagem de fundo dashboard" src={letStart} />
        <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
          Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
        </p>
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
    </>
  );
}
