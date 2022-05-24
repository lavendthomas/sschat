import { Text, Box, useColorModeValue, Button } from "@chakra-ui/react";
import { SpinnerIcon } from "@chakra-ui/icons";

import { useState, useEffect, useRef } from "react";

import * as openpgp from "openpgp";

import { fetchApiPost } from "../core/FetchApi";
import getPassword, { GLOBALS } from "../core/GlobalVariables";

export default function ChatInput(props) {
  const [decryptedMessageList, setDecryptedMessageList] = useState([]);
  const [messageList, updateMessageList] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //     console.log("ChatInput useEffect")
  // }, [props, decryptedMessageList]);

  useEffect(() => {
    refreshMessages();
  }, [props.refresh]);

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessageList]);

  useEffect(() => {
    // updateMessageList();
    console.log("ChatInput useEffect", messageList);
    messageList.map((msg) => {
      console.log("msg", msg.value.message);
      decryptMessage(msg.value.message).then((decryptedMessage) => {
        setDecryptedMessageList((prev) => [
          ...prev,
          {
            direction:
              msg.id[1] == localStorage.getItem("whoami") ? "received" : "sent",
            message: decryptedMessage,
          },
        ]);
      });
    });
  }, [messageList]);

  const decryptMessage = async (message) => {
    const me = localStorage.getItem("whoami");

    const our_private_key = await openpgp.decryptKey({
      privateKey: await openpgp.readKey({
        armoredKey: JSON.parse(
          localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + me)
        ).privateKey,
      }),
      passphrase: getPassword(),
    });

    const pgp_message = await openpgp.readMessage({
      armoredMessage: message, // parse armored message
    });

    // console.log("to decrypt", message)
    // console.log("our_private_key", our_private_key)
    // console.log("pgp_message", pgp_message)

    const decrypted = await openpgp.decrypt({
      message: pgp_message,
      decryptionKeys: our_private_key,
      config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib },
    });

    // console.log("decrypted", decrypted)

    // TODO check that the message is signed
    // decryptionKeys: privateKey,
    // expectSigned: true,

    return decrypted.data;
  };

  const grayBubbleColor = useColorModeValue("gray.100", "gray.700");
  const greeBubbleColor = useColorModeValue("green.100", "green.700");

  const refreshMessages = async () => {
    fetchApiPost("msg/get_messages", {}, async (json) => {
      json.received.forEach((msg) => {
        props.chatStorage.add_message(
          msg.sender,
          localStorage.getItem("whoami"),
          msg.message
        );
      });
      await props.chatStorage.get_messages(
        localStorage.getItem("whoami"),
        props.peer_username,
        updateMessageList
      );
    });
  };

  const ShowMessages = () => {
    return decryptedMessageList.map((msg) => {
      console.log(msg);
      return (
        <Box
          margin={"1em"}
          width={"50%"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg={msg.direction == "received" ? greeBubbleColor : grayBubbleColor}
        >
          <Text margin={".25em"}>{msg.message}</Text>
        </Box>
      );
    });
  };

  return (
    <Box
      width={"100%"}
      height={"80vh"}
      marginTop={"2em"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      overflowY="scroll"
    >
      <Button leftIcon={<SpinnerIcon />} onClick={refreshMessages}>
        Refresh
      </Button>
      <Box
        margin={"1em"}
        width={"50%"}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={greeBubbleColor}
      >
        <Text margin={".25em"}>Hello !</Text>
      </Box>
      <Box
        margin={"1em"}
        width={"50%"}
        borderWidth="1px"
        borderRadius="lg"
        overflow={"auto"}
        bg={grayBubbleColor}
      >
        <Text margin={".25em"}>
          Quidem, ipsam illum quis sed voluptatum quae eum fugit earum !
        </Text>
      </Box>
      <ShowMessages />
      <div ref={messagesEndRef} />
    </Box>
  );
}
