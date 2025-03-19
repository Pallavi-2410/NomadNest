import { Box, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { IoIosArrowBack } from "react-icons/io";

const PaymentPage = () => {
    return (
        <Box p={5} maxW="76%" mx="auto">
            <Flex alignItems={'center'} >
                <IoIosArrowBack size={"25px"} />
                <Heading ml={"20px"} fontSize={"xx-large"}>Confirm and pay</Heading>
                </Flex>
            <Box>
                <Heading>This is a rare find.</Heading>
            </Box>

        </Box>
    )
}

export default PaymentPage
