import pino from "pino";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import logger from "../util/logger";

function getLogLevel(_req: IncomingMessage, res: ServerResponse, err?: Error): pino.LevelWithSilent {
  if (err || res.statusCode >= 500) {
    return "error";
  }
  if (res.statusCode >= 400) {
    return "warn";
  }
  return "info";
}

function serializeReq(req: IncomingMessage & { id?: string; query?: unknown }) {
  return {
    id: req.id,
    method: req.method,
    path: req.url?.split("?")[0],
    query: req.query,
    userAgent: req.headers["user-agent"],
    contentType: req.headers["content-type"],
    contentLength: req.headers["content-length"],
    remoteAddress: req.socket?.remoteAddress,
  };
}

function requestMessage(req: IncomingMessage, res: ServerResponse) {
  return `${req.method} ${req.url?.split("?")[0]} → ${res.statusCode}`;
}

function errorMessage(req: IncomingMessage, res: ServerResponse, err: Error) {
  return `${requestMessage(req, res)} (${err.message})`;
}

const httpLogger = pinoHttp({
  logger,
  genReqId: () => crypto.randomUUID(),
  serializers: {
    req: serializeReq,
    res: (res) => ({ statusCode: res.statusCode }),
  },
  customLogLevel: getLogLevel,
  customSuccessMessage: (req, res, _responseTime) => requestMessage(req, res),
  customErrorMessage: errorMessage,
});

export default httpLogger;
