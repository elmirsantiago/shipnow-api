
import { open } from "node:fs/promises";

import AppError from "../errors/AppError.js";

const FILE_SIGNATURES = Object.freeze({
  "application/pdf": Buffer.from(
    [0x25, 0x50, 0x44, 0x46, 0x2d]
  ),
  "image/jpeg": Buffer.from(
    [0xff, 0xd8, 0xff]
  ),
  "image/png": Buffer.from(
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  )
});

export const validateFileContent = async (file) => {
  if (!file) {
    throw new AppError("FILE_REQUIRED");
  }

  const expectedSignature = FILE_SIGNATURES[file.mimetype];

  if (!expectedSignature) {
    throw new AppError("INVALID_FILE_TYPE");
  }

  let handle;

  try {
    handle = await open(file.path, "r");

    const buffer = Buffer.alloc(expectedSignature.length);

    const { bytesRead } = await handle.read(
      buffer,
      0,
      buffer.length,
      0
    );

    if (
      bytesRead !== expectedSignature.length ||
      !buffer.equals(expectedSignature)
    ) {
      throw new AppError(
        "INVALID_FILE_TYPE",
        "El contenido del archivo no coincide con su formato"
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("FILE_UPLOAD_ERROR");
  } finally {
    await handle?.close();
  }
};
