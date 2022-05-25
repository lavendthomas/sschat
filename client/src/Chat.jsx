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
  useDisclosure
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import ChatStorage from "./core/ChatStorage";
import { PublicKeyStorage } from "./core/PublicKeyStorage";

const Chat = (props) => {
  const navigate = useNavigate();
  if (props.password.password == "") {
    navigate("/"); // login
  } else {
    console.log("password: ", props.password.password)
  }

  const [selectedUser, setSelectedUser] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [chatStorage, setChatStorage] = useState(
    new ChatStorage(localStorage.getItem("whoami"))
  );
  const [refresh, setRefresh] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();


  useEffect(() => {
    console.log("code for friend", selectedUser);
    PublicKeyStorage.getSecurityCode(selectedUser).then((code) => {
      setSecurityCode(code);
    });
  }, [selectedUser]);

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
              isPasswordPromptOpen={isOpen}
              onPasswordPromptOpen={onOpen}
              onPasswordPromptClose={onClose}
            />
            <ChatInput
              peer_username={selectedUser}
              chatStorage={chatStorage}
              refresh={refresh}
              setRefresh={setRefresh}
              isPasswordPromptOpen={isOpen}
              onPasswordPromptOpen={onOpen}
              onPasswordPromptClose={onClose}
            />
          </Container>
        )}
      </VStack>
      <Spacer />
    </Flex>
  );
};

export default Chat;
