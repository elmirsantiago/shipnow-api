
import UserModel from "../models/user.model.js";

class UsersRepository {
  async getAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find()
        .select("-password")
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      UserModel.countDocuments()
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getById(id) {
    return UserModel.findById(id)
      .select("-password")
      .lean();
  }

  async create(data) {
    return UserModel.create(data);
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select("-password");
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id)
      .select("-password");
  }
}

export default new UsersRepository();
