
import express from "express";

import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.router.js";
import mocksRouter from "./routes/mocks.router.js";

// Logging centralizado - Módulo 4
import logger from "./config/logger.js";

// Manejo centralizado de errores - Módulo 3
import AppError from "./errors/AppError.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// Rutas principales
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);

// Rutas de mocking - Módulo 2
app.use("/api/mocks", mocksRouter);

// Endpoint de prueba del logger - Módulo 4
// Disponible solamente en desarrollo
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

// Verificación del servidor
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShipNow API funcionando correctamente"
  });
});

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenido a ShipNow API"
  });
});

// Rutas no encontradas
app.use((req, res, next) => {
  next(new AppError("ROUTE_NOT_FOUND"));
});

// Middleware global de errores
// Siempre debe estar después de todas las rutas
app.use(errorHandler);

export default app;
