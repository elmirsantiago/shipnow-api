
import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", usersController.getAll);

// Obtener usuario por ID
router.get("/:uid", usersController.getById);

// Crear usuario
router.post("/", usersController.create);

// Actualizar usuario
router.put("/:uid", usersController.update);

// Eliminar usuario
router.delete("/:uid", usersController.delete);

export default router;
