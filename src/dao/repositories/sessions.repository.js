import { userModel } from "../models/user.model.js";

class UsersRepository {
  constructor() {
    this.model = userModel;
  }

  getUser = async (query) => {
    try {
      const user = await this.model.findOne(query);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  getUserById = async (id) => {
    try {
      const user = await this.model.findById(id);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  registerUser = async (user) => {
    try {
      const newUser = await this.model.create(user);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  };

  updatePassword = async (query, update) => {
    try {
      const updatedUser = await this.model.updateOne(query, update);
      console.log("Password updated successfully!");
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  };
}

export const usersRepository = new UsersRepository();
