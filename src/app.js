
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.router.js";
import mocksRouter from "./routes/mocks.router.js";
import filesRouter from "./routes/files.router.js";

import config from "./config/index.js";
import logger from "./config/logger.js";
import AppError from "./errors/AppError.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Limitar el tamaño de los cuerpos JSON
app.use(express.json({ limit: "100kb" }));

// Evitar exponer información sobre Express
app.disable("x-powered-by");

// Swagger disponible para documentar y probar la API
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check sin información sensible
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: config.nodeEnv,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);

// Carga de documentos y comprobantes
app.use("/api", filesRouter);

// Endpoints internos disponibles solo fuera de producción
if (config.nodeEnv !== "production") {
  app.use("/api/mocks", mocksRouter);

  app.get("/api/loggerTest", (req, res) => {
    logger.debug("Prueba del nivel DEBUG");
    logger.http("Prueba del nivel HTTP");
    logger.info("Prueba del nivel INFO");
    logger.warning("Prueba del nivel WARNING");
    logger.error("Prueba del nivel ERROR");
    logger.fatal("Prueba del nivel FATAL");

    res.status(200).json({
      status: "success",
      message: "Prueba de logging ejecutada correctamente",
      levels: [
        "debug",
        "http",
        "info",
        "warning",
        "error",
        "fatal"
      ]
    });
  });
}

// Ruta inicial
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenido a ShipNow API"
  });
});

// Ruta inexistente
app.use((req, res, next) => {
  next(new AppError("ROUTE_NOT_FOUND"));
});

// Middleware global de errores
app.use(errorHandler);

export default app;
