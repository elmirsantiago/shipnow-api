
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

import AppError from "../errors/AppError.js";

export const UPLOAD_ROOT = path.resolve("uploads");

export const UPLOAD_DIRECTORIES = Object.freeze({
  userDocuments: path.join(UPLOAD_ROOT, "users", "documents"),
  userLicenses: path.join(UPLOAD_ROOT, "users", "licenses"),
  orderProofs: path.join(UPLOAD_ROOT, "orders", "proofs")
});

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = Object.freeze({
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png"
});

export const DOCUMENT_TYPES = Object.freeze([
  "dni",
  "license",
  "other"
]);

const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdir(destination, { recursive: true }, (error) => {
        if (error) {
          return callback(
            new AppError("FILE_UPLOAD_ERROR")
          );
        }

        callback(null, destination);
      });
    },

    filename: (req, file, callback) => {
      const extension = ALLOWED_MIME_TYPES[file.mimetype];

      const generatedName =
        `${Date.now()}-${crypto.randomUUID()}${extension}`;

      callback(null, generatedName);
    }
  });

const fileFilter = (req, file, callback) => {
  if (!Object.hasOwn(ALLOWED_MIME_TYPES, file.mimetype)) {
    return callback(new AppError("INVALID_FILE_TYPE"));
  }

  callback(null, true);
};

const createUploader = (destination) =>
  multer({
    storage: createStorage(destination),
    fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
      fields: 2,
      parts: 3
    }
  });

export const uploadUserDocument = createUploader(
  UPLOAD_DIRECTORIES.userDocuments
);

export const uploadUserLicense = createUploader(
  UPLOAD_DIRECTORIES.userLicenses
);

export const uploadOrderProof = createUploader(
  UPLOAD_DIRECTORIES.orderProofs
);
