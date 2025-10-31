import { auth } from "@/lib/auth";
import { ActionResponse, withErrorHandler } from "./error-handler";
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
export function withAuth<TArgs extends any[], TReturn = any>(
  handler: (
    userId: string,
    session: Session | null,
    ...args: TArgs
  ) => Promise<ActionResponse<TReturn>>,
  defaultMessage?: string
): (...args: TArgs) => Promise<ActionResponse<TReturn>> {
  return withErrorHandler(async (...args: TArgs) => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }

    return handler(userId, session, ...args);
  }, defaultMessage);
}
