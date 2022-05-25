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
} from "@chakra-ui/react";

import ChatStorage from "./core/ChatStorage";
import { PublicKeyStorage } from "./core/PublicKeyStorage";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [chatStorage, setChatStorage] = useState(
    new ChatStorage(localStorage.getItem("whoami"))
  );
  const [refresh, setRefresh] = useState(false);

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
            />
            <ChatInput
              peer_username={selectedUser}
              chatStorage={chatStorage}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </Container>
        )}
      </VStack>
      <Spacer />
    </Flex>
  );
};

export default Chat;
