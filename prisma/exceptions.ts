// exceptions.ts
import { Prisma } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function handlePrismaError(error: unknown, router: AppRouterInstance) {
  console.error("Database error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return router.push("/error?reason=duplicate");
      case "P2003":
        return router.push("/error?reason=foreign-key");
      case "P2025":
        return router.push("/error?reason=not-found");
      default:
        return router.push("/error?reason=unknown-prisma");
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return router.push("/error?reason=validation");
  }

  return router.push("/error?reason=general");
}
