import React, { useState } from "react";
import SideBar from "./components/SideBar";
import ChatInput from "./components/ChatInput";
import ChatArea from "./components/ChatArea";
import { Flex, VStack, Spacer, Heading } from "@chakra-ui/react";

import ChatStorage from "./core/ChatStorage";

const Chat = () => {

    const [selectedUser, setSelectedUser] = useState("test7@example.com");
    const [chatStorage, setChatStorage] = useState(new ChatStorage(localStorage.getItem("whoami")));

    return (
        <Flex>
            <SideBar />
            <Spacer />
            <VStack alignSelf={'center'} width={'60%'}>
                <Heading>{selectedUser}</Heading>
                <ChatArea peer_username={selectedUser} chatStorage={chatStorage} />
                <ChatInput peer_username={selectedUser} chatStorage={chatStorage} />
            </VStack>
            <Spacer />
        </Flex>
    );
};


export default Chat;