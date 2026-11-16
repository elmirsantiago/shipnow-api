
import { Router } from "express";

import filesController from "../controllers/files.controller.js";

import {
  uploadUserDocument,
  uploadOrderProof
} from "../config/multer.js";

const router = Router();

router.post(
  "/users/:uid/documents",
  uploadUserDocument.single("file"),
  filesController.uploadUserDocument
);

router.post(
  "/orders/:oid/proof",
  uploadOrderProof.single("file"),
  filesController.uploadOrderProof
);

export default router;
