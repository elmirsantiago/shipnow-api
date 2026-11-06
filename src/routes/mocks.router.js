
import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// Generación de datos ficticios
router.get(
  "/users",
  mocksController.getMockUsers
);

router.get(
  "/couriers",
  mocksController.getMockCouriers
);

router.get(
  "/orders",
  mocksController.getMockOrders
);

router.get(
  "/deliveries",
  mocksController.getMockDeliveries
);

// Inserción de datos en MongoDB
router.post(
  "/seed",
  mocksController.seed
);

export default router;
