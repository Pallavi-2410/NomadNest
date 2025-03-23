import { HStack, Text, Box } from '@chakra-ui/react';
import React from 'react';
import "../styles/styles.css"


const FooterBottom = () => {
    return (
        <Box as="footer" mt="auto" width="100%">
            <hr />
            <HStack flexDirection={{ base: "column", md: "row" }} justifyContent="space-between" p={4} fontSize="small" pr={{base: 0,md:12}} pl={{base:0,md:12}}>
                <Text>© 2025 NomadNest, Inc. · Privacy · Terms · Sitemap · Company details</Text>
                <HStack gap={5}>
                    <Text>English (IN)</Text>
                    <Text>₹ INR</Text>
                    <Text>Support & resources</Text>
                </HStack>
            </HStack>
        </Box>
    );
};

export default FooterBottom;
