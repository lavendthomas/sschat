import React from "react";
import SideBar from "./components/SideBar";
import ChatInput from "./components/ChatInput";
import ChatArea from "./components/ChatArea";
import { Flex, VStack, Spacer, Heading } from "@chakra-ui/react";

export let PGP_KEY_PASSWORD = ""; // TODO Security ? Use a canary ?
export let CHAT_STORAGE = null;

export let peer_username = "John Doe";

const Chat = () => {
    return (
        <Flex>
            <SideBar />
            <Spacer />
            <VStack alignSelf={'center'} width={'60%'}>
                <Heading>{peer_username}</Heading>
                <ChatArea />
                <ChatInput peer_username={peer_username}/>
            </VStack>
            <Spacer />
        </Flex>
    );
};


export default Chat;