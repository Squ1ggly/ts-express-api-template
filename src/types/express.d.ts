import { IncomingMessage } from "node:http";
import { ISiteStub } from "./api-types";

declare global {
  namespace Express {
    interface Request {
      raw: Buffer;
    }
  }
  namespace http {
    interface IncomingMessage {
      raw: Buffer;
    }
  }
}

declare module "http" {
  interface IncomingMessage {
    raw: Buffer;
  }
}
