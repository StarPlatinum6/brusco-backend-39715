import { messagesService } from "../services/messages.service.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await messagesService.getMessages();
    return res.send({ status: "success", payload: messages });
  } catch (error) {
    console.log(`Failed to get messages: ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to get messages" });
  }
};
