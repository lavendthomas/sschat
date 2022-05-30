export let GLOBALS = {
  WEBSTORAGE_KEYPAIR_ENTRY_PREFIX: "keypair-",
  WEBSTORAGE_PUBLIC_KEY_ENTRY_PREFIX: "public-key-",
  PGP_KEY_PASSWORD: "", // Security ? Use a canary ?
};

function getPassword(onPasswordPromptOpen) {
  if (GLOBALS.PGP_KEY_PASSWORD) {
    return GLOBALS.PGP_KEY_PASSWORD;
  } else {
    const password = prompt("Please enter your password");
    GLOBALS.PGP_KEY_PASSWORD = password;
    return password;
  }
}

export function setGlobalPassword(password) {
  GLOBALS.PGP_KEY_PASSWORD = password;
}

export default getPassword;
