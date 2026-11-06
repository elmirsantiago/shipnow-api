
import { Router } from "express";
import storesController from "../controllers/stores.controller.js";

const router = Router();

// Obtener todos los comercios
router.get("/", storesController.getAll);

// Obtener comercio por ID
router.get("/:sid", storesController.getById);

// Crear comercio
router.post("/", storesController.create);

// Actualizar comercio
router.put("/:sid", storesController.update);

// Eliminar comercio
router.delete("/:sid", storesController.delete);

export default router;
