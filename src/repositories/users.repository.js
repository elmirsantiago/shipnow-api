
import UserModel from "../models/user.model.js";

class UsersRepository {
  async getAll() {
    return UserModel.find()
      .select("-password")
      .lean();
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
