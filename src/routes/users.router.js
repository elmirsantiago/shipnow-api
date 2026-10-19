import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const router = Router();

router.get("/", (req, res) => usersController.getAll(req, res));

router.get("/:uid", (req, res) => usersController.getById(req, res));

router.post("/", (req, res) => usersController.create(req, res));

router.put("/:uid", (req, res) => usersController.update(req, res));

router.delete("/:uid", (req, res) => usersController.delete(req, res));

export default router;
