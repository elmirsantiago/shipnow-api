
import UserModel from "../models/user.model.js";
import StoreModel from "../models/store.model.js";
import OrderModel from "../models/order.model.js";
import DeliveryModel from "../models/delivery.model.js";
import { USER_ROLES } from "../utils/constants.js";

class MocksRepository {
  async createUsers(users) {
    return UserModel.insertMany(users);
  }

  async createOrders(orders) {
    return OrderModel.insertMany(orders);
  }

  async createDeliveries(deliveries) {
    return DeliveryModel.insertMany(deliveries);
  }

  async getActiveStores() {
    return StoreModel.find({
      isActive: true
    }).lean();
  }

  async getCustomers() {
    return UserModel.find({
      role: USER_ROLES.USER
    }).lean();
  }

  async getCouriers() {
    return UserModel.find({
      role: USER_ROLES.COURIER
    }).lean();
  }
}

export default new MocksRepository();
