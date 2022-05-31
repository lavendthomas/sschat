export let GLOBALS = {
  WEBSTORAGE_KEYPAIR_ENTRY_PREFIX: "keypair-",
  WEBSTORAGE_PUBLIC_KEY_ENTRY_PREFIX: "public-key-",
  PGP_KEY_PASSWORD: "",
};

/**
 * Returns the passowrd of the PGP key. If no password is set,
 * a prompt will appear asking the user to retype the password. 
 * @returns the password of the PGP key
 */
function getPassword() {
  if (GLOBALS.PGP_KEY_PASSWORD) {
    return GLOBALS.PGP_KEY_PASSWORD;
  } else {
    const password = prompt("Please enter your password");
    GLOBALS.PGP_KEY_PASSWORD = password;
    return password;
  }
}

/**
 * This function stores the password in a global variable.
 * it can then be retreived with the getPassword function.
 * @param {string} password The new password to store 
 */
export function setGlobalPassword(password) {
  GLOBALS.PGP_KEY_PASSWORD = password;
}

export default getPassword;
