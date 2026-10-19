
import "dotenv/config";

const requiredVariables = ["MONGODB_URI"];

for (const variable of requiredVariables) {
  if (!process.env[variable]?.trim()) {
    throw new Error(
      `Error de configuración: falta la variable obligatoria ${variable}`
    );
  }
}

const config = Object.freeze({
  port: Number(process.env.PORT || 8080),
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || "development"
});

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
  throw new Error("Error de configuración: PORT debe ser un puerto válido");
}

export default config;
