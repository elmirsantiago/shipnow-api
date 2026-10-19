
import OrderModel from "../models/order.model.js";

class OrdersRepository {
  async getAll() {
    return OrderModel.find()
      .populate("customer", "-password")
      .populate("store")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return OrderModel.findById(id)
      .populate("customer", "-password")
      .populate("store")
      .lean();
  }

  async create(data) {
    return OrderModel.create(data);
  }

  async updateStatus(id, status) {
    return OrderModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async delete(id) {
    return OrderModel.findByIdAndDelete(id);
  }
}

export default new OrdersRepository();
