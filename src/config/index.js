
import "dotenv/config";

const allowedEnvironments = [
  "development",
  "production",
  "test"
];

const allowedLogLevels = [
  "fatal",
  "error",
  "warning",
  "info",
  "http",
  "debug"
];

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 8080);
const mongodbUri = process.env.MONGODB_URI?.trim();

const defaultLogLevel =
  nodeEnv === "production" ? "info" : "debug";

const logLevel =
  process.env.LOG_LEVEL?.trim() || defaultLogLevel;

const externalServiceUrl =
  process.env.EXTERNAL_SERVICE_URL?.trim() || "";

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(
    `Error de configuración: NODE_ENV inválido (${nodeEnv}). Valores permitidos: ${allowedEnvironments.join(", ")}`
  );
}

if (
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  throw new Error(
    "Error de configuración: PORT debe ser un número entero entre 1 y 65535"
  );
}

if (!mongodbUri) {
  throw new Error(
    "Error de configuración: falta la variable obligatoria MONGODB_URI"
  );
}

if (!allowedLogLevels.includes(logLevel)) {
  throw new Error(
    `Error de configuración: LOG_LEVEL inválido (${logLevel}). Valores permitidos: ${allowedLogLevels.join(", ")}`
  );
}

if (externalServiceUrl) {
  try {
    const url = new URL(externalServiceUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Protocolo inválido");
    }
  } catch {
    throw new Error(
      "Error de configuración: EXTERNAL_SERVICE_URL debe ser una URL HTTP o HTTPS válida"
    );
  }
}

const config = Object.freeze({
  port,
  mongodbUri,
  nodeEnv,
  logLevel,
  externalServiceUrl
});

export default config;
