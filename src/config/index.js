
import "dotenv/config";

const requiredVariables = ["MONGODB_URI"];

for (const variable of requiredVariables) {
  if (!process.env[variable]?.trim()) {
    throw new Error(
      `Error de configuración: falta la variable obligatoria ${variable}`
    );
  }
}

const allowedEnvironments = [
  "development",
  "production",
  "test"
];

const port = Number(process.env.PORT || 8080);
const nodeEnv = process.env.NODE_ENV || "development";

if (
  !Number.isInteger(port) ||
  port < 1 ||
  port > 65535
) {
  throw new Error(
    "Error de configuración: PORT debe ser un número entero entre 1 y 65535"
  );
}

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(
    `Error de configuración: NODE_ENV inválido (${nodeEnv}). Valores permitidos: development, production, test`
  );
}

const config = Object.freeze({
  port,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv
});

export default config;
