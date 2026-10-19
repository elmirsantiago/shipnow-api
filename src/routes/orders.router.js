
import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";

const router = Router();

router.get("/", (req, res) => ordersController.getAll(req, res));

router.get("/:oid", (req, res) => ordersController.getById(req, res));

router.post("/", (req, res) => ordersController.create(req, res));

router.put("/:oid/status", (req, res) =>
  ordersController.updateStatus(req, res)
);

router.delete("/:oid", (req, res) =>
  ordersController.delete(req, res)
);

export default router;
