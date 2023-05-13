import userModel from "../models/user.model.js";

export default class UserManager {
  constructor() {}

  getUser = async (query) => {
    try {
      const user = await userModel.findOne(query);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  registerUser = async (user) => {
    try {
      const newUser = await userModel.create(user);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  };
}
