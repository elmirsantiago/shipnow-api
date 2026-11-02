
import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

router.get("/users", (req, res) =>
  mocksController.getUsers(req, res)
);

router.get("/couriers", (req, res) =>
  mocksController.getCouriers(req, res)
);

router.get("/orders", (req, res) =>
  mocksController.getOrders(req, res)
);

router.get("/deliveries", (req, res) =>
  mocksController.getDeliveries(req, res)
);

router.post("/seed", (req, res) =>
  mocksController.seed(req, res)
);

export default router;
