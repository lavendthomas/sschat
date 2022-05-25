import { 
  InputGroup, 
  Input, 
  InputRightElement, 
  Button, 
} from "@chakra-ui/react";
import { useState } from "react";

import * as openpgp from "openpgp";

import { fetchApiPost } from "../core/FetchApi";
import { GLOBALS } from "../core/GlobalVariables";
import { PublicKeyStorage } from "../core/PublicKeyStorage";

export default function ChatInput(props) {
  const [message, setMessage] = useState("");

  const handleClick = async () => {

    const me = localStorage.getItem("whoami");
    const armoured_other_public_key = PublicKeyStorage.get_public_key(props.peer_username);
    const our_armoured_public = PublicKeyStorage.get_public_key(me);

    const other_public_key = await openpgp.readKey({
      armoredKey: armoured_other_public_key,
    });
    const our_private_key = await openpgp.decryptKey({
      privateKey: await openpgp.readKey({
          armoredKey: JSON.parse(
            localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + me)
          ).privateKey,
        }),
        passphrase: props.password,
      });

    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      format: "armored",
      encryptionKeys: other_public_key,
      signingKeys: our_private_key,
      config: {
        preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
      },
    });

    fetchApiPost(
      "msg/send_message",
      { to: props.peer_username, message: encrypted },
      (json) => {
        // console.log(json);
      }
    );

    // Store an encrypted version of the message to ourselves
    const our_public_key = await openpgp.readKey({
      armoredKey: our_armoured_public,
    });
    const encrypted_to_ourselves = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      format: "armored",
      encryptionKeys: our_public_key,
      signingKeys: our_private_key,
      config: {
        preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
      },
    });

    props.chatStorage.add_message(
      me,
      props.peer_username,
      encrypted_to_ourselves,
      new Date().getTime() / 1000
    );
    props.setRefresh(!props.refresh);
    setMessage("");
  };

  

  return (
    <div>
      <InputGroup size="md">
      <Input
        pr="4.5rem"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          Send
        </Button>
        <Button onClick={props.onPasswordPromptOpen} h="1.75rem" size="sm">Modal</Button>
      </InputRightElement>
    </InputGroup>
    </div>
  );
}
