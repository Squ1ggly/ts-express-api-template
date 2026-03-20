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
// Leaving this here for future use if you want to use elasticsearch for logging.
// targets.push({
//   target: "pino-elasticsearch",
//   level: LOG_LEVEL,
//   options: {
//     node: {elasticSearchNodeUrl},
//     index: {elasticSearchIndex},
//     esVersion: 8,
//     flushBytes: 1000
//   }
// });

const logger = pino({
  level: LOG_LEVEL,
  ...(targets.length > 0 && {
    transport: { targets }
  })
});

export default logger;
