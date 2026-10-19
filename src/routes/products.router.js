
import { Router } from "express";
import productsController from "../controllers/products.controller.js";

const router = Router();

router.get("/", (req, res) => productsController.getAll(req, res));

router.get("/:pid", (req, res) => productsController.getById(req, res));

router.post("/", (req, res) => productsController.create(req, res));

router.put("/:pid", (req, res) => productsController.update(req, res));

router.delete("/:pid", (req, res) => productsController.delete(req, res));

export default router;
