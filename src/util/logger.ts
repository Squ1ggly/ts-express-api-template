import pino from "pino";

const LOG_LEVEL: pino.Level = "info";

type Target = pino.TransportTargetOptions;

const targets: Target[] = [];

if (process.env.NODE_ENV !== "production") {
  targets.push({
    target: "pino-pretty",
    level: LOG_LEVEL,
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  });
}

const logger = pino({
  level: LOG_LEVEL,
  ...(targets.length > 0 && {
    transport: { targets }
  })
});

export default logger;
