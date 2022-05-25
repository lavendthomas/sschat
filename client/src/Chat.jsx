import React, { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import ChatInput from "./components/ChatInput";
import ChatArea from "./components/ChatArea";
import { Flex, VStack, Spacer, Heading, HStack, Text } from "@chakra-ui/react";

import ChatStorage from "./core/ChatStorage";
import { PublicKeyStorage } from "./core/PublicKeyStorage";

const Chat = () => {

    const [selectedUser, setSelectedUser] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [chatStorage, setChatStorage] = useState(new ChatStorage(localStorage.getItem("whoami")));
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        console.log('code for friend', selectedUser)
        PublicKeyStorage.getSecurityCode(selectedUser).then(
            (code) => {
              setSecurityCode(code);
            }
          )
    }, [selectedUser])

    return (
        <Flex>
            <SideBar setSelectedUser={setSelectedUser} />
                <Spacer />
                <VStack alignSelf={'center'} width={'60%'}>
                    {selectedUser === "" ? <p>Please choose a friend to start a chat.</p> :
                    <div>
                        <HStack>
                            <Heading>{selectedUser}</Heading>
                            <Text>#{securityCode}</Text>
                        </HStack>
                        <ChatArea peer_username={selectedUser} chatStorage={chatStorage} refresh={refresh}/>
                        <ChatInput peer_username={selectedUser} chatStorage={chatStorage} refresh={refresh} setRefresh={setRefresh} />    
                    </div>}
                </VStack>
                <Spacer />
        </Flex>
    );
};


export default Chat;