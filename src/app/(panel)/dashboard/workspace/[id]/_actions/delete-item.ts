"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteItem(id: string) {
  try {
    await prisma.item.delete({
      where: { id: id }
    })
    revalidatePath("/dashboard/Workspace");
    return;
  } catch (error) {
    return {
      error: "Falha ao deletar item"
    }
  }
}