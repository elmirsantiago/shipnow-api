
import productsService from "../services/products.service.js";

class ProductsController {
  async getAll(req, res, next) {
    try {
      const products = await productsService.getAllProducts();

      return res.json({
        status: "success",
        payload: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productsService.getProductById(req.params.pid);

      return res.json({
        status: "success",
        payload: product
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productsService.createProduct(req.body);

      return res.status(201).json({
        status: "success",
        payload: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productsService.updateProduct(
        req.params.pid,
        req.body
      );

      return res.json({
        status: "success",
        payload: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const product = await productsService.deleteProduct(req.params.pid);

      return res.json({
        status: "success",
        payload: product
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductsController();
