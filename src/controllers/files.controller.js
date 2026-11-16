
import filesService from "../services/files.service.js";

class FilesController {
  async uploadUserDocument(req, res, next) {
    try {
      const result = await filesService.uploadUserDocument(
        req.params.uid,
        req.body?.documentType,
        req.file
      );

      return res.status(201).json({
        status: "success",
        message: "Documento cargado correctamente",
        payload: result
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadOrderProof(req, res, next) {
    try {
      const result = await filesService.uploadOrderProof(
        req.params.oid,
        req.file
      );

      return res.status(201).json({
        status: "success",
        message: "Comprobante cargado correctamente",
        payload: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FilesController();
