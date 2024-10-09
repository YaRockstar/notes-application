import MongoUserModel from '../schemas/user.model.js';

class UserModel {
  async createUser(user) {
    const mongoUserModel = new MongoUserModel({
      email: user.email,
      password: user.password,
      fullName: user.fullName,
    });

    return await this.updateUser(mongoUserModel);
  }

  async updateUser(user) {
    await user.save();
    return user;
  }

  async findById(userId) {
    return await MongoUserModel.findOne({ _id: userId });
  }

  async findByEmail(email) {
    return await MongoUserModel.findOne({ email: email });
  }
}

export const userModel = new UserModel();
