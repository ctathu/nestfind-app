import { prisma } from "@/server/db/prisma";
import { handleRouteError, successResponse } from "@/server/lib/api-response";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return successResponse({
      status: "ok",
      service: "nestfind",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
