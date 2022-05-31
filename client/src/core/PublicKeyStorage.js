import { GLOBALS } from "./GlobalVariables";

/**
 * This class is a wrapper over localStorage to provide a central place
 * to store the public key of all users.
 */
export class PublicKeyStorage {
  
  /**
   * This function stores the public key of a user in the localStorage, or replace the
   * existing one if it already exists.
   * @param {string} other_user The user to store the public key of
   * @param {string} public_key The public key to store
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

  /**
   * Gets the public key for a user.
   * @param {string} user the user to get the public key of 
   * @returns 
   */
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

  /**
   * Generates a security code from a public key. 
   * The security code is a 6-digit code that is generated 
   * from the hash public key of the
   * @param {*} publicKey The public key to generate the security code from
   * @returns  the security code of the user
   */
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
  
  /**
   * Returns the security code for a specific user.
   * The security code is a 6-digit code that is generated 
   * from the hash public key of the user.
   * @param {string} user The user to get the security code of
   * @returns the security code of the user
   */
  static async getSecurityCode(user) {
    const public_key = this.get_public_key(user);
    return await this._generateCodeFromPublicKey(public_key);
  }
}
