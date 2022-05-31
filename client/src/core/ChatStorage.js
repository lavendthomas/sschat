import Dexie from "dexie";
const LOCALSTORAGE_KEY = "chat-storage";

/**
 * @class ChatStorage
 * @classdesc The ChatStorage class is a wrapper for the Dexie local storage.
 */
class ChatStorage {
  /**
   * The ChatStorage constructor.
   * @param {*} us The user object.
   */
  constructor(us) {
    this.us = us;
    // this.load();
    this.db = new Dexie(LOCALSTORAGE_KEY);
    this.db.version(1).stores({
      chat: "++id, from_user, to_user , message, timestamp",
    });
  }

  /**
   * This method loads the chat history from the local storage.
   * @param {*} from_user The user object.
   * @param {*} to_user The recipient object.
   * @param {*} updateMessageList The function to call when the message list is updated.
   */
  async get_messages(from_user, to_user, updateMessageList) {
    try {
      const messages_from = await this.db.chat
        .where({ from_user: from_user, to_user: to_user })
        .toArray();
      const messages_to = await this.db.chat
        .where({ from_user: to_user, to_user: from_user })
        .toArray();
      const messages = messages_from.concat(messages_to);
      // .map((messages) => updateMessageList(messages));
      messages.sort((a, b) => a.timestamp - b.timestamp);
      updateMessageList(messages);
    } catch (e) {}
  }

  /**
   * This method add a message to the local storage.
   * @param {*} from_user The user object.
   * @param {*} to_user The recipient object.
   * @param {*} message The message object.
   * @param {*} timestamp The timestamp of the message.
   */
  async add_message(from_user, to_user, message, timestamp) {
    try {
      await this.db.chat.add({
        from_user: from_user,
        to_user: to_user,
        message: message,
        timestamp: timestamp,
      });
    } catch (e) {}
  }
}

export default ChatStorage;
