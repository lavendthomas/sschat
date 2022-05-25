const LOCALSTORAGE_KEY = "chat-storage";

class ChatStorage {

  constructor(us) {
    this.us = us;
    console.log("us", us);
    this.load();
    this.db = indexedDB.open(LOCALSTORAGE_KEY, 1);
  }

  get_messages(from_user, to_user, updateMessageList) {
    const transaction = this.db.transaction("chat", "readwrite");
    const objectStore = transaction.objectStore("chat");
    const query = objectStore.getAll([from_user, to_user]);
    query.onsuccess = (e) => {
      const messages = query.result;
      updateMessageList(messages);
    };
  }

  add_message(from_user, to_user, message) {
    // console.log(message);
    // add message to indexedDB
    const transaction = this.db.transaction("chat", "readwrite");
    const objectStore = transaction.objectStore("chat");
    const request = objectStore.put({
      value: {
        from_to_user: [from_user, to_user],
        message: message,
        timestamp: Date.now(),
      },
      id: [from_user, to_user],
    });
    request.onsuccess = (e) => {
      console.log("message added");
    };
    request.onerror = (e) => {
      console.log("error adding message");
    };
  }

  load() {
    // initialize indexedDB
    const request = indexedDB.open(LOCALSTORAGE_KEY, 1);
    request.onerror = (e) => {
      console.log("error opening indexedDB");
    };
    request.onsuccess = (e) => {
      this.db = e.target.result;
      this.db.onerror = (e) => {
        console.log("error opening indexedDB");
      };
    };
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      const objectStore = db.createObjectStore("chat", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("from_to_user", ["from_user", "to_user"], {
        unique: false,
      });
      objectStore.createIndex("timestamp", "timestamp", { unique: false });
      objectStore.createIndex("message", "message", { unique: false });
    };
  }
}

export default ChatStorage;
