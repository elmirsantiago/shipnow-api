
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./index.js";

const isProduction = config.nodeEnv === "production";

// Niveles personalizados de ShipNow
const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

// Formato de los mensajes
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) =>
    `${timestamp} [${level}] ${message}`
);

const loggerFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  logFormat
);

// Filtro exclusivo para errores críticos
const onlyErrors = winston.format((info) => {
  if (info.level === "error" || info.level === "fatal") {
    return info;
  }

  return false;
});

// En todos los entornos se registran logs en consola.
// Docker puede consultarlos con "docker logs".
const transports = [
  new winston.transports.Console({
    level: config.logLevel
  })
];

// En desarrollo y testing también se guardan archivos rotativos.
if (!isProduction) {
  transports.push(
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
      maxFiles: "14d",
      auditFile: "logs/.error-audit.json",
      format: winston.format.combine(
        onlyErrors(),
        loggerFormat
      )
    })
  );

  transports.push(
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: config.logLevel,
      maxSize: "10m",
      maxFiles: "7d",
      auditFile: "logs/.combined-audit.json",
      format: loggerFormat
    })
  );
}

const logger = winston.createLogger({
  levels,
  level: config.logLevel,
  format: loggerFormat,
  transports
});

export default logger;
