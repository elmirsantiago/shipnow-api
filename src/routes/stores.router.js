
import { Router } from "express";
import storesController from "../controllers/stores.controller.js";

const router = Router();

router.get("/", (req, res) => storesController.getAll(req, res));

router.get("/:sid", (req, res) => storesController.getById(req, res));

router.post("/", (req, res) => storesController.create(req, res));

router.put("/:sid", (req, res) => storesController.update(req, res));

router.delete("/:sid", (req, res) => storesController.delete(req, res));

export default router;
