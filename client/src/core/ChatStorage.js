
const LOCALSOTRAGE_KEY = 'chat-storage';

class ChatStorage {

    constructor(us) {
        this.us = us;
        this.load();
    }

    get_messages(from_user) {
        if (this.storage[from_user]) {
            return this.storage[from_user];
        } else {
            return [];
        }
    }

    add_message(from_user, to_user, message) {

        if (to_user === this.us) {
            if (!this.storage[from_user]) {
                this.storage[from_user] = [];
            }
            this.storage[from_user].push({
                direction: "received",
                message: message
            });
        } else {
            if (!this.storage[to_user]) {
                this.storage[to_user] = [];
            }
            this.storage[to_user].push({
                direction: "sent",
                message: message
            });
        }
        
        this.save();
    }


    save() {
        localStorage.setItem(LOCALSOTRAGE_KEY, JSON.stringify(this.storage));
    }

    load() {
        this.storage = JSON.parse(localStorage.getItem(LOCALSOTRAGE_KEY));
    }



}