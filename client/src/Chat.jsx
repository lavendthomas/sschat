import React, { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import ChatInput from "./components/ChatInput";
import ChatArea from "./components/ChatArea";
import {
  Flex,
  VStack,
  Spacer,
  Center,
  HStack,
  Text,
  Container,
  useDisclosure,
} from "@chakra-ui/react";

import { setGlobalPassword, GLOBALS } from "./core/GlobalVariables";
import { PasswordModal } from "./components/PasswordModal";

import * as openpgp from "openpgp";

import ChatStorage from "./core/ChatStorage";
import { PublicKeyStorage } from "./core/PublicKeyStorage";
import { useNavigate } from "react-router-dom";

const Chat = (props) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [password, setPassword] = useState(props.password.password);

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const chatStorage = new ChatStorage(localStorage.getItem("whoami"));

  const navigate = useNavigate();

  useEffect(() => {
    if (!("whoami" in localStorage)) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    console.log("code for friend", selectedUser);
    PublicKeyStorage.getSecurityCode(selectedUser).then((code) => {
      setSecurityCode(code);
    });
  }, [selectedUser]);

  useEffect(() => {
    if (password === "") {
      onOpen();
    }
  }, [refresh]);

  const handleOnPasswordPromptOk = async () => {
    const keypair =
      GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + localStorage.getItem("whoami");
    console.log("keypair", keypair);
    await openpgp.decryptKey({
      privateKey: await openpgp.readKey({
        armoredKey: JSON.parse(localStorage.getItem(keypair)).privateKey,
      }),
      passphrase: password,
    });
    setGlobalPassword(password);
    onClose();
  };
  return (
    <Flex>
      <SideBar setSelectedUser={setSelectedUser} />
      <Spacer />
      <VStack alignSelf={"center"} minWidth={"60%"} maxWidth={"80%"}>
        {selectedUser === "" ? (
          <p>Please choose a friend to start a chat.</p>
        ) : (
          <Container width={"100%"}>
            <Center>
              <HStack>
                <Text fontSize="xl">{selectedUser}</Text>
                <Text fontSize="sm">#{securityCode}</Text>
              </HStack>
            </Center>
            <ChatArea
              peer_username={selectedUser}
              chatStorage={chatStorage}
              refresh={refresh}
            />
            <ChatInput
              peer_username={selectedUser}
              chatStorage={chatStorage}
              refresh={refresh}
              setRefresh={setRefresh}
              password={password}
            />
          </Container>
        )}
      </VStack>
      <Spacer />
      <>
      <PasswordModal
        isOpen={isOpen}
        onClose={onClose}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleOnPasswordPromptOk}
        modalBody={"Your password will be used to decrypt your messages."}
      />
      </>
    </Flex>
  );
};

export default Chat;
