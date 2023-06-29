import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import { createHash, isValidPassword } from "../utils.js";

import { usersRepository } from "../repositories/index.js";
import UserDTO from "../dao/dtos/user.dto.js";

const {
  jwt: { JWT_SECRET },
} = config;

export default class UserService {
  constructor() {}

  async getUser(email) {
    try {
      const user = await usersRepository.getUser({ email });
      if (!user) throw new Error(`User with email ${email} does not exist`);
      return user;
    } catch (error) {
      console.log(`Failed to get user with error: ${error}`);
      throw error;
    }
  }

  async getUserByCartId(cartId) {
    try {
      const user = await usersRepository.getUserByCartId(cartId);
      if (!user) throw new Error(`User with cart ID ${cartId} does not exist`);
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async checkExistingUser(email) {
    try {
      const user = await usersRepository.getUser({ email });
      if (user) throw new Error(`User with email ${email} already exists`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  passwordValidate(user, password) {
    return isValidPassword(user, password);
  }

  generateJwtToken(user, rememberMe) {
    try {
      const userDTO = new UserDTO(user);
      const jwtUser = JSON.parse(JSON.stringify(userDTO));

      const expireTime = rememberMe ? "7d" : "3h";

      const token = jwt.sign(jwtUser, JWT_SECRET, {
        expiresIn: expireTime,
      });
      if (!token) throw new Error("Auth token signing failed");

      return token;
    } catch (error) {
      console.log(`Failed to generate token: ${error}`);
      throw error;
    }
  }

  async registerUser(newUser) {
    try {
      const user = await usersRepository.registerUser(newUser);
      if (!user) throw new Error("Error trying to create user");
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updatePassword(email, password) {
    try {
      const hashedPassword = createHash(password);
      if (!hashedPassword) throw new Error("Password hashing failed");

      const passwordUpdate = await usersRepository.updatePassword(
        { email },
        { password: hashedPassword }
      );
      if (!passwordUpdate)
        throw new Error(`Password update failed for user with email ${email}`);

      return passwordUpdate;
    } catch (error) {
      console.log(`Failed to update password: ${error}`);
      throw error;
    }
  }
}
