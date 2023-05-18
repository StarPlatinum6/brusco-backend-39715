// import MessageManager from "../dao/fileManagers/messageManager.js";
import MessageManager from "../dao/dbManagers/messageManager.js";

const messageManager = new MessageManager();

export const getMessages = async (req, res) => {
    const messages = await messageManager.getMessages();
    return res.send({ status: "success", payload: messages });
  };