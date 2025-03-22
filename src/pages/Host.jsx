import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Host = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Heading>It's easy to get started on Nomad Nest.
                Let's start nesting...
            </Heading>
            <VStack>
                <Heading>1 Tell us about your place</Heading>
                <Text>Share some basic info, such as where it is and how many guests can stay.</Text>
                {/* <Image src={image1} /> */}

                <hr />

                <Heading>Make it stand out</Heading>
                <Text>Add photo plus a title and description - we'll help you out.</Text>

                <hr />

                <Heading>Finish up and publish</Heading>
                <Text>Choose a starting price, verify a few details, then publish your listing.</Text>
                <Button onClick={navigate("/add-property")}>Lets start..!!</Button>
            </VStack>

        </Box>
    )
}

export default Host
