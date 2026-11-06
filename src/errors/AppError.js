
import { ERROR_DICTIONARY } from "./errorDictionary.js";

class AppError extends Error {
  constructor(errorType, customMessage = null) {
    const errorDefinition = ERROR_DICTIONARY[errorType];

    if (!errorDefinition) {
      throw new Error(
        `Tipo de error no definido: ${errorType}`
      );
    }

    super(customMessage ?? errorDefinition.message);

    this.name = "AppError";
    this.code = errorDefinition.code;
    this.statusCode = errorDefinition.statusCode;

    Error.captureStackTrace?.(this, AppError);
  }
}

export default AppError;
