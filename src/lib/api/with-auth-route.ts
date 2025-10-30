import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";
import {
  AppError,
  AuthenticationError,
  DuplicateError,
  NotFoundError,
  PermissionError,
  RelationError,
  ValidationError
} from "../errors";

type RouteContext = {
  params?: Promise<Record<string, string>>;
};

type AuthRouteHandler = (
  request: NextRequest,
  userId: string,
  session: Session,
  context?: RouteContext
) => Promise<NextResponse>;

/**
 * Uso:
 * ```typescript
 * export const GET = withAuthRoute(async (req, userId, session, context) => {
 *  const { workspaceId } = await context!.params!;
 *
 *   return NextResponse.json({
 *     success: true,
 *     data: {
 *       workspace: member.workspace,
 *       member: { role: member.role, userId: member.userId }
 *     }
 *   });
 * });
 * ```
 */
export function withAuthRoute(handler: AuthRouteHandler) {
  return auth(async function (req, context?: RouteContext) {
    try {
      if (!req.auth?.user?.id) {
        throw new AuthenticationError();
      }

      const userId = req.auth.user.id;
      const session = req.auth as Session;

      return await handler(req, userId, session, context);

    } catch (error) {
      console.error("Erro na rota:", error);

      // Mapa de erros para status codes
      const errorStatusMap: Record<string, number> = {
        AuthenticationError: 401,
        PermissionError: 403,
        NotFoundError: 404,
        ValidationError: 400,
        DuplicateError: 409,
        RelationError: 400,
      };

      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      if (error instanceof Error && error.name in errorStatusMap) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: errorStatusMap[error.name] }
        );
      }

      // Erro desconhecido
      return NextResponse.json(
        { success: false, error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  });
}