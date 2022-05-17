import React from "react";
import SideBar from "./components/SideBar";
import ChatInput from "./components/ChatInput";
import ChatArea from "./components/ChatArea";
import { Flex, VStack, Spacer, Heading } from "@chakra-ui/react";

export let PGP_KEY_PASSWORD = ""; // TODO Security ? Use a canary ?
export let CHAT_STORAGE = null;

const Chat = () => {
    return (
        <Flex>
            <SideBar />
            <Spacer />
            <VStack alignSelf={'center'} width={'60%'}>
                <Heading>John Doe</Heading>
                <ChatArea />
                <ChatInput />
            </VStack>
            <Spacer />
        </Flex>
    );
};


export default Chat;