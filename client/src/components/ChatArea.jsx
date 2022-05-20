import { Text, Box, useColorModeValue, Button } from '@chakra-ui/react'
import { SpinnerIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { fetchApiPost } from '../core/FetchApi';
// import { useState } from 'react'

import { GLOBALS } from '../core/GlobalVariables';


export default function ChatInput(props) {

    const grayBubbleColor = useColorModeValue('gray.100', 'gray.700');
    const greeBubbleColor = useColorModeValue('green.100', 'green.700');

    
    // const [message, setMessage] = useState('');

    // const handleClick = () => {
    //     console.log(message)
    // }

    const refreshMessages = () => {
        fetchApiPost("msg/get_messages", {}, (json) => {
            console.log(json.received);
            json.received.forEach((msg) => {
                props.chatStorage.add_message(msg.sender, localStorage.getItem("whoami"), msg.message);
            });
        })

    }

    const ShowMessages = () => {
        console.log(props.chatStorage);
        console.log(props.chatStorage.get_messages(props.peer_username));
        return props.chatStorage.get_messages(props.peer_username).map(msg => {
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
        <Box width={'100%'} height={'80vh'} marginTop={'2em'} borderWidth='1px' borderRadius='lg' overflow='hidden' >
            <Button leftIcon={<SpinnerIcon />} onClick={refreshMessages}>Refresh</Button>
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow='hidden' bg={greeBubbleColor}>
            <Text margin={'.25em'}>Hello !</Text>
            </Box>
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow={'auto'} bg={grayBubbleColor}>
                <Text margin={'.25em'}>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum !</Text>
            </Box>
            <ShowMessages />
        </Box>
    )
}