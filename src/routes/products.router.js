
import { Router } from "express";
import productsController from "../controllers/products.controller.js";

const router = Router();

// Obtener todos los productos
router.get("/", productsController.getAll);

// Obtener producto por ID
router.get("/:pid", productsController.getById);

// Crear producto
router.post("/", productsController.create);

// Actualizar producto
router.put("/:pid", productsController.update);

// Eliminar producto
router.delete("/:pid", productsController.delete);

export default router;
