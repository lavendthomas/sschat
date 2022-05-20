
export let GLOBALS = {
    WEBSTORAGE_KEYPAIR_ENTRY_PREFIX: 'keypair-',
    PGP_KEY_PASSWORD: "",  // Security ? Use a canary ?
}

function getPassword() {
    if (GLOBALS.PGP_KEY_PASSWORD) {
        return GLOBALS.PGP_KEY_PASSWORD;
    } else {
        const password = prompt("Please enter your password");
        GLOBALS.PGP_KEY_PASSWORD = password;
        return password;
    }
}

export default getPassword;