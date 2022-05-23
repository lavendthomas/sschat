import { Text, Box, useColorModeValue, Button } from '@chakra-ui/react'
import { SpinnerIcon } from '@chakra-ui/icons';

import { useState, useEffect, useRef } from 'react';

import * as openpgp from 'openpgp';

import { fetchApiPost } from '../core/FetchApi';
import getPassword, { GLOBALS } from '../core/GlobalVariables';


export default function ChatInput(props) {

    const [decryptedMessageList, setDecryptedMessageList] = useState([]);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }  

    // useEffect(() => {
    //     console.log("ChatInput useEffect")
    // }, [props, decryptedMessageList]);

    useEffect(() => {
        refreshMessages();
    }, [props.refresh]);

    useEffect(() => {
        scrollToBottom()
      }, [decryptedMessageList]);



    const decryptMessage = async (message) => {
        const me = localStorage.getItem("whoami");

        const our_private_key =  await openpgp.decryptKey({
            privateKey: await openpgp.readKey({armoredKey: JSON.parse(localStorage.getItem(GLOBALS.WEBSTORAGE_KEYPAIR_ENTRY_PREFIX + me)).privateKey}),
            passphrase: getPassword(),
        });

        const pgp_message = await openpgp.readMessage({
            armoredMessage: message // parse armored message
        });

        // console.log("to decrypt", message)
        // console.log("our_private_key", our_private_key)
        // console.log("pgp_message", pgp_message)

        const decrypted = await openpgp.decrypt({
            message: pgp_message,
            decryptionKeys: our_private_key,
            config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
        })

        // console.log("decrypted", decrypted)

        // TODO check that the message is signed
        // decryptionKeys: privateKey,
        // expectSigned: true,

        return decrypted.data;
    }

    const grayBubbleColor = useColorModeValue('gray.100', 'gray.700');
    const greeBubbleColor = useColorModeValue('green.100', 'green.700');

    const refreshMessages = async () => {
        fetchApiPost("msg/get_messages", {}, async (json) => {
            // console.log(json.received);
            json.received.forEach((msg) => {
                props.chatStorage.add_message(msg.sender, localStorage.getItem("whoami"), msg.message);
            });

            
            
            console.log("decrypting messages");
            const decryptedMessages = await Promise.all(props.chatStorage.get_messages(props.peer_username).map(msg => decryptMessage(msg.message)));
            console.log("messages decrypted")
            // console.log(decryptedMessages);
            // TODO do not decryt everything

            const message_list = props.chatStorage.get_messages(props.peer_username).map((msg, i) => {
                return {
                    "direction": msg.direction,
                    "message": decryptedMessages[i],
                }
            });
            // console.log("decryptedMessageList updated to ", message_list);
            setDecryptedMessageList(message_list);
        })
    }

    const ShowMessages = () => {
        // console.log(decryptedMessageList);
        return decryptedMessageList.map(msg => {
            if (msg.direction == "received") {
                return (
                    <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow='hidden' bg={greeBubbleColor}>
                        <Text margin={'.25em'}>{msg.message}</Text>
                    </Box>
                )
            } else {
                return (
                    <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow={'auto'} bg={grayBubbleColor}>
                        <Text margin={'.25em'}>{msg.message}</Text>
                    </Box>
                )
            }
        });
    }



    return (
        <Box width={'100%'} height={'80vh'} marginTop={'2em'} borderWidth='1px' borderRadius='lg' overflow='hidden' overflowY="scroll">
            <Button leftIcon={<SpinnerIcon />} onClick={refreshMessages}>Refresh</Button>
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow='hidden' bg={greeBubbleColor}>
            <Text margin={'.25em'}>Hello !</Text>
            </Box>
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow={'auto'} bg={grayBubbleColor}>
                <Text margin={'.25em'}>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum !</Text>
            </Box>
            <ShowMessages />
            <div ref={messagesEndRef} />
        </Box>
    )
}