
import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";

const router = Router();

// Obtener todos los pedidos
router.get("/", ordersController.getAll);

// Obtener un pedido por ID
router.get("/:oid", ordersController.getById);

// Crear un pedido
router.post("/", ordersController.create);

// Actualizar el estado de un pedido
router.put("/:oid/status", ordersController.updateStatus);

// Eliminar un pedido
router.delete("/:oid", ordersController.delete);

export default router;
