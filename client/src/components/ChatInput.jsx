import { InputGroup, Input, InputRightElement, Button    } from '@chakra-ui/react'
import { useState } from 'react'

import { fetchApiPost } from '../core/FetchApi';


export default function ChatInput(props) {

    const [message, setMessage] = useState('');

    const handleClick = () => {
        // Encrypt the message with the public key of the recipient.
        fetchApiPost("msg/get_pgp_key", {"user": props.peer_username}, (json) => {
            console.log(json);
        })

        console.log(message)
    }

    return (
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                placeholder='Type a message...'
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    Send
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}