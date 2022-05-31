import { Text, Box, Button } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { useState, useEffect, useRef } from "react";

import * as openpgp from "openpgp";

import { fetchApiPost } from "../core/FetchApi";
import getPassword, { GLOBALS } from "../core/GlobalVariables";
import { PublicKeyStorage } from "../core/PublicKeyStorage";

/**
 * This component is reponsible for rendering the chat area.
 * @param {*} props
 * @returns the chat area component
 */
export default function ChatArea(props) {
  const [decryptedMessageList, setDecryptedMessageList] = useState([]);
  const [messageList, updateMessageList] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    refreshMessages();
  }, [props.refresh]);

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessageList]);

  useEffect(() => {
    messageList
      .filter(
        (msg) =>
          !decryptedMessageList.map((m) => m.timestamp).includes(msg.timestamp)
      )
      .map((msg) => {
        decryptMessage(msg).then((decryptedMessage) => {
          setDecryptedMessageList((prev) => [
            ...prev,
            {
              direction:
                msg.to_user === localStorage.getItem("whoami")
                  ? "received"
                  : "sent",
              message: decryptedMessage,
              timestamp: msg.timestamp,
            },
          ]);
        });
        return msg;
      });
  }, [messageList]);

  /**
   * This function is responsible for decrypting the message using the private key
   * of the user and the public key of the other user for verification.
   * @param {*} message
   * @returns
   */
  const decryptMessage = async (message) => {
    const me = localStorage.getItem("whoami");

    const armoured_other_public_key = PublicKeyStorage.get_public_key(
      message.from_user
    );

    const other_public_key = await openpgp.readKey({
      armoredKey: armoured_other_public_key,
    });

    const our_private_key = await openpgp.decryptKey({
      privateKey: await openpgp.readKey({
        armoredKey: JSON.parse(
          localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + me)
        ).privateKey,
      }),
      passphrase: getPassword(),
    });

    const pgp_message = await openpgp.readMessage({
      armoredMessage: message.message, // parse armored message
    });

    const decrypted = await openpgp.decrypt({
      message: pgp_message,
      decryptionKeys: our_private_key,
      config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib },
      expectSigned: true,
      verificationKeys: other_public_key,
    });

    return decrypted.data;
  };

  const grayBubbleColor = "gray.100";
  const greeBubbleColor = "green.100";

  /**
   * This function is responsible for refreshing the messages.
   */
  const refreshMessages = async () => {
    fetchApiPost("msg/get_messages", {}, async (json) => {
      json.received.forEach((msg) => {
        props.chatStorage.add_message(
          msg.sender,
          localStorage.getItem("whoami"),
          msg.message,
          msg.timestamp
        );
      });
      await props.chatStorage.get_messages(
        localStorage.getItem("whoami"),
        props.peer_username,
        updateMessageList
      );
    });
  };

  /**
   * This function is responsible for the rendering of the decrypted messages.
   * It generates a Box component for each message.
   * @returns a list of decrypted messages
   */
  const ShowMessages = () => {
    return decryptedMessageList.map((msg) => {
      return (
        <Box
          margin={"1em"}
          width={"50%"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg={msg.direction === "received" ? greeBubbleColor : grayBubbleColor}
          key={msg.timestamp}
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
      marginTop={".25em"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      overflowY="scroll"
    >
      <Button
        leftIcon={<RepeatIcon />}
        onClick={refreshMessages}
        pos={"fixed"}
        marginLeft={"23.2em"}
      >
        Refresh
      </Button>
      <ShowMessages />
      <div ref={messagesEndRef} />
    </Box>
  );
}
