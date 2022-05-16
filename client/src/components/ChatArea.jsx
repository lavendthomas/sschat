import { Text, Box, useColorModeValue } from '@chakra-ui/react'
// import { useState } from 'react'


export default function ChatInput() {

    // const [message, setMessage] = useState('');

    // const handleClick = () => {
    //     console.log(message)
    // }

    const grayBubbleColor = useColorModeValue('gray.100', 'gray.700');
    const greeBubbleColor = useColorModeValue('green.100', 'green.700');

    return (
        <Box width={'100%'} height={'80vh'} marginTop={'2em'} borderWidth='1px' borderRadius='lg' overflow='hidden' >
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow='hidden' bg={greeBubbleColor}>
            <Text margin={'.25em'}>Hello !</Text>
            </Box>
            <Box margin={'1em'} width={'50%'}   borderWidth='1px' borderRadius='lg' overflow={'auto'} bg={grayBubbleColor}>
                <Text margin={'.25em'}>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum !</Text>
            </Box>
        </Box>
    )
}