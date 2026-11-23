
import OrderModel from "../models/order.model.js";

class OrdersRepository {
  async getAll({
    page = 1,
    limit = 10,
    status,
    priority
  } = {}) {
    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .populate("customer", "-password")
        .populate("store")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      OrderModel.countDocuments(filter)
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
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
