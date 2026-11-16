
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.router.js";
import mocksRouter from "./routes/mocks.router.js";

import logger from "./config/logger.js";
import AppError from "./errors/AppError.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// Documentación interactiva Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/mocks", mocksRouter);

// Endpoint de validación del logger
// Disponible únicamente fuera de producción
if (process.env.NODE_ENV !== "production") {
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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShipNow API funcionando correctamente"
  });
});

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
