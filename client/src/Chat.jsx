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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button
} from "@chakra-ui/react";

import { setGlobalPassword } from "./core/GlobalVariables";

import ChatStorage from "./core/ChatStorage";
import { PublicKeyStorage } from "./core/PublicKeyStorage";
import { useNavigate } from "react-router-dom";

const Chat = (props) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [password, setPassword] = useState(props.password.password);

  const { isOpen, onOpen, onClose } = useDisclosure({defaultIsOpen: false});

  const chatStorage = new ChatStorage(localStorage.getItem("whoami"));

  const navigate = useNavigate();

  useEffect(() => {
    if (!("whoami" in localStorage)) {
      navigate("/");
    }
  }
  , []);

  useEffect(() => {
    console.log("code for friend", selectedUser);
    PublicKeyStorage.getSecurityCode(selectedUser).then((code) => {
      setSecurityCode(code);
    });
  }, [selectedUser]);

  useEffect(() => {
    if (props.password.password === "") {
      onOpen();
    }
  }, [refresh]);

  const handleOnPasswordPromptOk = () => {
    props.password.password = password;
    setGlobalPassword(password);
    setPassword("");
    onClose();
  }
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
              password={props.password.password}
            />
          </Container>
        )}
      </VStack>
      <Spacer />
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          closeOnEsc={false}
        >
          <ModalOverlay />
          <ModalContent alignContent={"center"}>
            <ModalHeader>Please enter your account password</ModalHeader>
            <ModalBody>
              Your password will be used to decrypt your messages.
            </ModalBody>
            <Center>
            <Input width={'80%'} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Center>
            <ModalFooter>
              <Button
                mr={3}
                onClick={handleOnPasswordPromptOk}
              >
                OK
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Flex>
  );
};

export default Chat;
