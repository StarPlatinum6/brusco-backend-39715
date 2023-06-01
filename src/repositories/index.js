import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
import UsersRepository from "./sessions.repository.js";
import MessagesRepository from "./messages.repository.js";

export const productsRepository = new ProductsRepository();
export const cartsRepository = new CartsRepository();
export const usersRepository = new UsersRepository();
export const messagesRepository = new MessagesRepository();