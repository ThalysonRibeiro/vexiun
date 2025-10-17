
import { auth } from "@/lib/auth";
import { ActionResponse, handleError } from "./error-handler";
import { AuthenticationError } from "./custom-errors";
import { Session } from "next-auth";


/**
 * Uso:
 * ```typescript
 * export const getWorkspaces = withAuth(
 *  async (userId) => {
 *    const workspaces = await db.workspace.findMany({
 *      where: { ownerId: userId }
 *    });
 *
 *    return { data: workspaces };
 *  }
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAuth<T extends (userId: string, session: Session | null, ...args: any[]) => Promise<ActionResponse>>(
  handler: T,
  defaultMessage?: string
) {
  return withErrorHandler(
    async (...args: Parameters<T>) => {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        throw new AuthenticationError();
      }

      return handler(userId, session, ...args);
    },
    defaultMessage
  );
}


/**
 * Wrapper para try/catch em actions
 * 
 * Uso:
 * ```typescript
 * export const myAction = withErrorHandler(
 *   async (data) => {
 *     // lógica da action
 *     return { success: true, data: result };
 *   },
 *   "Falha ao executar ação"
 * );

 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<T extends (...args: any[]) => Promise<ActionResponse>>(
  handler: T,
  defaultMessage?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error, defaultMessage);
    }
  }) as T;
}