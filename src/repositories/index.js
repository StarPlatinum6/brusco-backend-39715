import { productDAO, cartDAO, userDAO, messageDAO } from "../dao/factory.js";

import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
import UsersRepository from "./sessions.repository.js";
import MessagesRepository from "./messages.repository.js";

export const productsRepository = new ProductsRepository(productDAO);
export const cartsRepository = new CartsRepository(cartDAO);
export const usersRepository = new UsersRepository(userDAO);
export const messagesRepository = new MessagesRepository(messageDAO);
