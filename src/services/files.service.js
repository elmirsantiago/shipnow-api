
import mongoose from "mongoose";
import path from "node:path";
import { unlink } from "node:fs/promises";

import UserModel from "../models/user.model.js";
import OrderModel from "../models/order.model.js";

import AppError from "../errors/AppError.js";
import logger from "../config/logger.js";

import {
  DOCUMENT_TYPES,
  UPLOAD_ROOT
} from "../config/multer.js";

import { validateFileContent } from "../utils/fileValidation.js";

class FilesService {
  async removeFile(file) {
    if (!file?.path) return;

    try {
      await unlink(file.path);
    } catch (error) {
      if (error.code !== "ENOENT") {
        logger.error(
          `No se pudo eliminar el archivo: ${error.message}`
        );
      }
    }
  }

  getMetadata(file, documentType = null) {
    return {
      originalName: file.originalname,
      generatedName: file.filename,
      path: path.relative(
        UPLOAD_ROOT,
        file.path
      ).replaceAll("\\", "/"),
      mimeType: file.mimetype,
      size: file.size,
      documentType,
      uploadedAt: new Date()
    };
  }

  async uploadUserDocument(userId, documentType, file) {
    try {
      if (!mongoose.isValidObjectId(userId)) {
        throw new AppError(
          "INVALID_DATA",
          "El ID del usuario no es válido"
        );
      }

      if (!file) {
        throw new AppError("FILE_REQUIRED");
      }

      if (
        typeof documentType !== "string" ||
        !DOCUMENT_TYPES.includes(documentType)
      ) {
        throw new AppError("INVALID_DOCUMENT_TYPE");
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        throw new AppError("USER_NOT_FOUND");
      }

      // Validar la firma real del archivo
      await validateFileContent(file);

      const metadata = this.getMetadata(
        file,
        documentType
      );

      user.documents.push(metadata);

      await user.save();

      logger.info(
        `Documento ${documentType} asociado al usuario ${userId}`
      );

      return {
        userId: user._id,
        document: metadata
      };
    } catch (error) {
      await this.removeFile(file);

      logger.warning(
        `Error al cargar documento de usuario: ${error.message}`
      );

      throw error;
    }
  }

  async uploadOrderProof(orderId, file) {
    try {
      if (!mongoose.isValidObjectId(orderId)) {
        throw new AppError(
          "INVALID_DATA",
          "El ID del pedido no es válido"
        );
      }

      if (!file) {
        throw new AppError("FILE_REQUIRED");
      }

      const order = await OrderModel.findById(orderId);

      if (!order) {
        throw new AppError("ORDER_NOT_FOUND");
      }

      // Validar la firma real del archivo
      await validateFileContent(file);

      const previousProof = order.proof;

      const metadata = this.getMetadata(file);

      order.proof = metadata;

      await order.save();

      // Eliminar el comprobante anterior después
      // de guardar correctamente el nuevo.
      if (previousProof?.path) {
        const previousFilePath = path.resolve(
          UPLOAD_ROOT,
          previousProof.path
        );

        const relativePath = path.relative(
          UPLOAD_ROOT,
          previousFilePath
        );

        if (
          relativePath &&
          !relativePath.startsWith("..") &&
          !path.isAbsolute(relativePath) &&
          previousFilePath !== path.resolve(file.path)
        ) {
          await this.removeFile({
            path: previousFilePath
          });
        }
      }

      logger.info(
        `Comprobante asociado al pedido ${orderId}`
      );

      return {
        orderId: order._id,
        proof: metadata
      };
    } catch (error) {
      await this.removeFile(file);

      logger.warning(
        `Error al cargar comprobante de pedido: ${error.message}`
      );

      throw error;
    }
  }
}

export default new FilesService();
