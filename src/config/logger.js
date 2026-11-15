
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isProduction = process.env.NODE_ENV === "production";

// Niveles personalizados de mayor a menor gravedad
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

// Formato general del logger
const loggerFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  logFormat
);

// Filtro exclusivo para errores y fallas críticas
const onlyErrors = winston.format((info) => {
  if (info.level === "error" || info.level === "fatal") {
    return info;
  }

  return false;
});

// Transporte de errores con rotación automática
const errorFileTransport = new DailyRotateFile({
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
});

// Transporte general con rotación automática
const combinedFileTransport = new DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: isProduction ? "info" : "debug",
  maxSize: "10m",
  maxFiles: "7d",
  auditFile: "logs/.combined-audit.json",
  format: loggerFormat
});

// Logger centralizado de ShipNow
const logger = winston.createLogger({
  levels,
  level: isProduction ? "info" : "debug",
  format: loggerFormat,
  transports: [
    new winston.transports.Console(),
    errorFileTransport,
    combinedFileTransport
  ]
});

export default logger;
