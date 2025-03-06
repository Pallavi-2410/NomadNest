import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { Box, Button, Avatar, Text, Flex, Heading } from "@chakra-ui/react";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <Box textAlign="center" mt={10}>
                <Heading size="lg">Please log in to access the dashboard</Heading>
                <Button colorScheme="blue" mt={4} onClick={() => navigate("/login")}>Login</Button>
            </Box>
        );
    }

    return (
        <Box p={5} maxW="600px" mx="auto">
            <Flex align="center" direction="column" gap={4}>
                {/* <Avatar src={user.photoURL} size="xl" /> */}
                <Heading size="md">{user.displayName}</Heading>
                <Text>Email: {user.email}</Text>
                <Button colorScheme="green" onClick={() => navigate("/add-property")}>List a Property</Button>
            </Flex>
        </Box>
    );
};

export default Dashboard;

