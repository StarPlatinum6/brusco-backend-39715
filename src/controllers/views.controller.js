import { productsService } from "../services/products.service.js";
import { cartsService } from "../services/carts.service.js";
import { messagesService } from "../services/messages.service.js";
import { ticketsService } from "../services/tickets.service.js";

export const loginView = (req, res) => {
  res.render("login", {
    style: "styles.css",
    title: "Ephemer - Login",
  });
};

export const registerView = (req, res) => {
  res.render("register", {
    style: "styles.css",
    title: "Ephemer - Register",
  });
};

export const profileView = (req, res) => {
  res.render("profile", {
    user: req.user,
    style: "styles.css",
    title: "Ephemer - Your Profile",
  });
};

export const restorePasswordView = (req, res) => {
  res.render("restore", {
    user: req.user,
    style: "styles.css",
    title: "Ephemer - Password Restore",
  });
};

export const homeView = async (req, res) => {
  try {
    const { limit = 10, page = 1, category, available, sort } = req.query;
    const {
      docs: products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    } = await productsService.getProducts(
      page,
      limit,
      category,
      available,
      sort
    );
    res.render("home", {
      user: req.user,
      products,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      style: "styles.css",
      title: "Ephemer - Products",
    });
  } catch (error) {
    req.logger.error(`Failed to render home view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render home view" });
  }
};

export const productView = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsService.getProductById(pid);

    if (!product) {
      return res.status(404).render("error", {
        message: "Error 404: Product not found",
        style: "styles.css",
        title: "Ephemer - Error",
      });
    }
    res.render("product", {
      role: req.user.role,
      cartId: req.user.cart,
      product,
      style: "styles.css",
      title: "Ephemer - Product Detail",
    });
  } catch (error) {
    req.logger.error(`Failed to render product view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render product view" });
  }
};

export const cartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsService.getCartById(cid);
    res.render("cart", {
      cart,
      style: "styles.css",
      title: "Ephemer - Cart Detail",
    });

    if (!cart) {
      return res.status(404).render("error", {
        message: "Error 404: Cart not found",
        style: "styles.css",
        title: "Ephemer - Error",
      });
    }
  } catch (error) {
    req.logger.error(`Failed to render cart view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render cart view" });
  }
};

export const ticketsView = async (req, res) => {
  try {
    const { email } = req.user;
    const userTickets = await ticketsService.getTicketsByEmail(email);
    userTickets.forEach((ticket) => {
      const date = new Date(ticket.purchase_datetime).toLocaleString();
      ticket.purchase_datetime = date;
    });
    res.render("tickets", {
      user: req.user,
      userTickets,
      style: "styles.css",
      title: "Ephemer - My Orders",
    });

    if (!userTickets) {
      return res.status(404).render("error", {
        message: "Error 404: Tickets not found",
        style: "styles.css",
        title: "Ephemer - Error",
      });
    }
  } catch (error) {
    req.logger.error(`Failed to render tickets view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render tickets view" });
  }
};

//////////////////////////////////////////////////////

export const realTimeProductsView = async (req, res) => {
  try {
    const { limit = 10, page = 1, category, available, sort } = req.query;
    const {
      docs: products,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    } = await productsService.getProducts(
      page,
      limit,
      category,
      available,
      sort
    );

    res.render("realTimeProducts", {
      products,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      style: "styles.css",
      title: "Ephemer - Real Time Products",
    });
  } catch (error) {
    req.logger.error(`Failed to render real time view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render real time view" });
  }
};

export const chatView = async (req, res) => {
  try {
    const messages = await messagesService.getMessages();
    res.render("chat", {
      messages,
      style: "styles.css",
      title: "Ephemer - Chat",
    });

    if (!messages) {
      return res.status(404).render("error", {
        message: "Error 404: Messages not found",
        style: "styles.css",
        title: "Ephemer - Error",
      });
    }
  } catch (error) {
    req.logger.error(`Failed to render chat view: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Failed to render chat view" });
  }
};
