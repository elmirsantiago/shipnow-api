
import ProductModel from "../models/product.model.js";

class ProductsRepository {
  async getAll() {
    return ProductModel.find({ isActive: true })
      .select("name description price stock category isActive createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return ProductModel.findById(id)
      .select("name description price stock category isActive createdAt updatedAt")
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
