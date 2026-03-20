import type { Request, Response } from "express";

type CheckStatus = "ok" | "error";

interface Check {
  status: CheckStatus;
  error?: string;
}

export default async function healthController(_req: Request, res: Response) {
  const checks: Record<string, Check> = {};

  const mem = process.memoryUsage();
  const overall: CheckStatus = Object.values(checks).some((c) => c.status === "error") ? "error" : "ok";

  res.status(overall === "ok" ? 200 : 503).json({
    data: {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        rss: mem.rss
      },
      checks
    }
  });
}
