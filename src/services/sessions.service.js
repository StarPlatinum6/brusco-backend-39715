import jwt from "jsonwebtoken";

import config from "../config.js";
import { createHash, isValidPassword } from "../utils.js";
import UserManager from "../dao/dbManagers/userManager.js";

const userManager = new UserManager();

class UserService {
  constructor() {}

  async getUser(email) {
    try {
      const user = await userManager.getUser({ email });
      return user;
    } catch (error) {
      console.log(`Failed to get user with error: ${error}`);
      throw error;
    }
  }

  passwordValidate(user, password) {
    return isValidPassword(user, password);
  }

  generateJwtToken(user, rememberMe) {
    console.log(user)
    try {
      const jwtUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      };

      const expireTime = rememberMe ? "7d" : "3h";

      const token = jwt.sign(jwtUser, config.JWT_SECRET, {
        expiresIn: expireTime,
      });

      return token;
    } catch (error) {
      console.log(`Failed to generate token: ${error}`);
      throw error;
    }
  }

  async updatePassword(email, password) {
    try {
      const hashedPassword = createHash(password);

      const passwordUpdate = await userManager.updatePassword(
        { email },
        { password: hashedPassword }
      );

      return passwordUpdate;
    } catch (error) {
      console.log(`Failed to update password: ${error}`);
      throw error;
    }
  }
}

export const userService = new UserService();
