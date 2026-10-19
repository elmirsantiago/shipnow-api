
import StoreModel from "../models/store.model.js";

class StoresRepository {
  async getAll() {
    return StoreModel.find({ isActive: true })
      .select("name address owner isActive createdAt updatedAt")
      .lean();
  }

  async getById(id) {
    return StoreModel.findById(id)
      .select("name address owner isActive createdAt updatedAt")
      .lean();
  }

  async create(data) {
    return StoreModel.create(data);
  }

  async update(id, data) {
    return StoreModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return StoreModel.findByIdAndDelete(id);
  }
}

export default new StoresRepository();
