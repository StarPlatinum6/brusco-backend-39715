export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getTickets = async () => {
    try {
      const tickets = await this.dao.getTickets();
      return tickets;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getTicketById = async (ticketId) => {
    try {
      const ticket = await this.dao.getTicketById(ticketId);
      return ticket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getTicketsByEmail = async (email) => {
    try {
      const ticket = await this.dao.getTicketsByEmail(email);
      return ticket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createTicket = async (ticket) => {
    try {
      const newTicket = await this.dao.createTicket(ticket);
      return newTicket;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
