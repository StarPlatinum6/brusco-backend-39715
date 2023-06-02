import { v4 as uuidv4 } from "uuid";
import {
  ticketsRepository,
  cartsRepository,
  usersRepository,
  productsRepository,
} from "../repositories/index.js";

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

  async createTicket(cid) {
    try {
      const products = [];
      let ammount = 0;

      const filteredCart = await cartsRepository.getCartById(cid);
      if (!filteredCart) throw new Error(`Cart with id: ${cid} does not exist`);

      filteredCart.products.forEach((product) => {
        const pid = product.productId._id,
          qty = product.quantity,
          stock = product.productId.stock,
          price = product.productId.price,
          title = product.productId.title;

        if (qty > stock) {
          const deletedProductFromCart = cartsRepository.deleteProductFromCart(
            cid,
            pid
          );
          if (!deletedProductFromCart)
            throw new Error(`Error deleting product ${pid} from cart ${cid}`);
          console.warn(
            `Product ${title} is out of stock and has been removed from the cart`
          );
        } else {
          products.push({ item: title, quantity: qty, total: price * qty });

          const deletedProductFromCart = cartsRepository.deleteProductFromCart(
            cid,
            pid
          );
          if (!deletedProductFromCart)
            throw new Error(`Error deleting product ${pid} from cart ${cid}`);

          const newStock = { stock: stock - qty };
          productsRepository.updateProduct(pid, newStock);
        }
        ammount += price * qty;
      });

      const code = uuidv4();
      const currentDate = new Date();
      const purchase_datetime = currentDate.toLocaleString();
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
}

export const ticketsService = new TicketService();
