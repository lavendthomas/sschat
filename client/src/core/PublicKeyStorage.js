import { GLOBALS } from "./GlobalVariables";

export class PublicKeyStorage {
  /**
   *
   * @param {} other_user
   * @param {*} public_key
   * @returns true is the key was updated
   */
  static update(other_user, public_key) {
    if (other_user === localStorage.getItem("whoami")) {
      // We should not update our own public key without regenerating the key pair.
      return false;
    }
    if (this.get_public_key(other_user) == null) {
      this._set_public_key(other_user, public_key);
      return true;
    }
    if (public_key !== this.get_public_key(other_user)) {
      this._generateCodeFromPublicKey(public_key).then((data) => {
        window.alert(
          `Your local key for ${other_user} doesn't match with the copy from the server. This means that either your local copy was corrupted or tampered with, or the other user has modified his key. You should contact ${other_user} with an out-of-band communication to make sure the key is correct. Its security code is ${data} \n\n Update to the new key?`
        );
        this._set_public_key(other_user, public_key);
      });
    }
  }

  static _set_public_key(user, public_key) {
    localStorage.setItem(
      GLOBALS.WEBSTORAGE_PUBLIC_KEY_ENTRY_PREFIX + user,
      JSON.stringify(public_key)
    );
  }

  static get_public_key(user) {
    if (!user) {
      return;
    }
    if (user === localStorage.getItem("whoami")) {
      return JSON.parse(
        localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + user)
      ).publicKey;
    } else {
      const key = localStorage.getItem(
        GLOBALS.WEBSTORAGE_PUBLIC_KEY_ENTRY_PREFIX + user
      );
      if (key) {
        return JSON.parse(key);
      }
      return null;
    }
  }

  static async _generateCodeFromPublicKey(publicKey) {
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(publicKey)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex.substring(0, 6);
  }

  static async getSecurityCode(user) {
    const public_key = this.get_public_key(user);
    return await this._generateCodeFromPublicKey(public_key);
  }
}
