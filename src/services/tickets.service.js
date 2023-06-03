import { v4 as uuidv4 } from "uuid";
import { transport } from "../config/nodemailer.js";
import config from "../config/config.js";
import {
  ticketsRepository,
  cartsRepository,
  usersRepository,
  productsRepository,
} from "../repositories/index.js";

const { EMAIL_USER } = config;

class TicketService {
  constructor() {}

  async getTickets() {
    try {
      const tickets = await ticketsRepository.getTickets();
      if (!tickets) throw new Error(`No tickets found`);

      return tickets;
    } catch (error) {
      console.log(`Failed to get ticket with error: ${error}`);
      throw error;
    }
  }

  async getTicketById(tid) {
    try {
      const filteredTicket = await ticketsRepository.getTicketById(tid);
      if (!filteredTicket)
        throw new Error(`Ticket with id: ${tid} does not exist`);

      return filteredTicket;
    } catch (error) {
      console.log(`Failed to get ticket with error: ${error}`);
      throw error;
    }
  }

  async getTicketsByEmail(email) {
    try {
      const filteredTickets = await ticketsRepository.getTicketsByEmail(email);
      if (!filteredTickets)
        throw new Error(`No tickets with email: ${email} exist`);

      return filteredTickets;
    } catch (error) {
      console.log(`Failed to get tickets with error: ${error}`);
      throw error;
    }
  }

  async createTicket(cid) {
    try {
      const cart = await cartsRepository.getCartById(cid);
      if (!cart) throw new Error(`Cart with id: ${cid} does not exist`);

      const products = [];
      let ammount = 0;

      cart.products.forEach(
        ({ productId: { _id: pid, stock, price, title }, quantity: qty }) => {
          if (qty > stock) {
            const deletedProductFromCart =
              cartsRepository.deleteProductFromCart(cid, pid);
            if (!deletedProductFromCart)
              throw new Error(`Error deleting product ${pid} from cart ${cid}`);
            console.warn(`Product ${title} is out of stock. Removed from cart`);
          } else {
            products.push({
              productId: pid,
              quantity: qty,
              total: price * qty,
            });

            const deletedProductFromCart =
              cartsRepository.deleteProductFromCart(cid, pid);
            if (!deletedProductFromCart)
              throw new Error(`Error deleting product ${pid} from cart ${cid}`);

            const newStock = { stock: stock - qty };
            productsRepository.updateProduct(pid, newStock);
            ammount += price * qty;
          }
        }
      );

      if (products.length === 0)
        throw new Error("All products were out of stock.");
      console.log(products);

      const code = uuidv4();
      const purchase_datetime = new Date().toLocaleString();
      const { email: purchaser } = await usersRepository.getUserByCartId(cid);

      const ticket = {
        products,
        code,
        purchase_datetime,
        ammount,
        purchaser,
      };

      const newTicket = await ticketsRepository.createTicket(ticket);
      if (!newTicket) throw new Error("Error creating new ticket");

      return newTicket;
    } catch (error) {
      console.log(`Failed to create ticket with error: ${error}`);
      throw error;
    }
  }

  async sendTicketEmail(mail) {
    try {
      const sentEmail = await transport.sendMail({
        from: `Ephemer Gaming ${EMAIL_USER}`,
        to: mail.email,
        subject: mail.subject,
        html: mail.html,
      });

      if (!sentEmail) throw new Error(`Email send failure`);

      return sentEmail;
    } catch (error) {
      console.log(`Failed to send email with error: ${error}`);
      throw error;
    }
  }
}

export const ticketsService = new TicketService();
