import CartService from "./carts.service.js";
import MessageService from "./messages.service.js";
import ProductService from "./products.service.js";
import TicketService from "./tickets.service.js";
import UserService from "./users.service.js";

import NodemailerService from "../mail/nodemailer.js";
const mailService = new NodemailerService();

export const cartService = new CartService();
export const messageService = new MessageService();
export const productService = new ProductService();
export const ticketService = new TicketService(mailService);
export const userService = new UserService(mailService);
