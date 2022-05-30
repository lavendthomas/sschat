function generateCodeFromPublicKey(publicKey) {
  return publicKey.substring(0, publicKey.length / 2);
}

function getSecurityCode(user) {
  if (user === localStorage.getItem("whoami")) {
    const our_public_key = JSON.parse(
      localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + user)
    ).publicKey;
    return generateCodeFromPublicKey(our_public_key);
  } else {
    const their_public_key = JSON.parse(
      localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + user)
    ).publicKey;
    return generateCodeFromPublicKey(their_public_key);
  }
}

export default getSecurityCode;
