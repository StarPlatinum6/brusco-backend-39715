import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import { createHash, isValidPassword } from "../utils.js";

import { usersRepository } from "../repositories/index.js";
import UserDTO from "../dao/dtos/user.dto.js";

import { emailTemplates } from "../mail/templates.js";

const {
  jwt: { JWT_SECRET },
} = config;

export default class UserService {
  constructor(mailService) {
    this.mailService = mailService;
  }

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

      const userDTO = new UserDTO(user);
      const { email, name, role } = userDTO;

      const mail = {
        to: email,
        subject: `Welcome to Ephemer Gaming ${name}!`,
        html: emailTemplates.newUserGreetingEmail(name, role),
      };

      await this.mailService.sendEmail(mail);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async restorePasswordProcess(email) {
    try {
      const user = await usersRepository.getUser({ email });
      if (!user) throw new Error(`Something went wrong`);

      const userDTO = new UserDTO(user);
      const { name } = userDTO;

      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      if (!token) throw new Error("Auth token signing failed");

      const mail = {
        to: email,
        subject: `Your Ephemer Gaming password restore, ${name}!`,
        html: emailTemplates.passwordRestoreEmail(email, name, token),
      };

      await this.mailService.sendEmail(mail);
      return;
    } catch (error) {
      console.log(`Failed to send email: ${error}`);
      throw error;
    }
  }

  async updatePassword(token, password) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET, {
        ignoreExpiration: true,
      });
      const { email } = decodedToken;
      if (Date.now() / 1000 > decodedToken.exp) {
        throw new Error("Token has expired. Request another restore link.");
      }

      const user = await usersRepository.getUser({ email });
      const samePass = this.passwordValidate(user, password);
      if (samePass)
        throw new Error("Password must be different from the actual one.");

      const hashedPassword = createHash(password);
      if (!hashedPassword) throw new Error("Password hashing failed");

      const passwordUpdate = await usersRepository.updateUser(
        { email },
        { password: hashedPassword }
      );
      if (!passwordUpdate)
        throw new Error(`Password update failed for ${email}`);
      return passwordUpdate;
    } catch (error) {
      console.log(`Failed to update password: ${error}`);
      throw error;
    }
  }

  async changeRole(uid) {
    try {
      let { role } = await usersRepository.getUser({ _id: uid });
      role === "user" ? (role = "premium") : (role = "user");

      const roleChanged = await usersRepository.updateUser(
        { _id: uid },
        { role }
      );
      if (!roleChanged)
        throw new Error(`Failed to change role for user ${uid}`);
      return roleChanged;
    } catch (error) {
      console.log(`Failed to change role: ${error}`);
      throw error;
    }
  }
}
