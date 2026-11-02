
import ProductModel from "../models/product.model.js";
import { PRODUCT_STATUS } from "../utils/constants.js";

class ProductsRepository {
  async getAll() {
    return ProductModel.find({
      status: PRODUCT_STATUS.AVAILABLE
    })
      .select("name description price stock category status createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return ProductModel.findById(id)
      .select("name description price stock category status createdAt updatedAt")
      .lean();
  }

  async create(data) {
    return ProductModel.create(data);
  }

  async update(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductsRepository();
