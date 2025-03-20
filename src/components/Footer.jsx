import { HStack, Text } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
    return (
        <>
        <hr />
        <HStack justifyContent={"space-between"} p={4} fontSize={"small"} pr={12} pl={12}>
            <Text>© 2025 NomadNest, Inc. ·Privacy · Terms · Sitemap · Company details</Text> 
            
            <HStack gap={5}>
                <Text>English (IN)</Text>
                <Text>₹ INR</Text>
                <Text>Support & resources</Text>
            </HStack>
        </HStack>
        </>
    )
}

export default Footer
