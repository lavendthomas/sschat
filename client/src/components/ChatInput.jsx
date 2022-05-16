import { InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react'
import { useState } from 'react'


export default function ChatInput() {

    const [message, setMessage] = useState('');

    const handleClick = () => {
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