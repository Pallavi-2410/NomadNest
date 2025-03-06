import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Avatar, Text } from "@chakra-ui/react";
import { handleGoogleSignIn, handleSignOut } from "../firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Navbar = () => {
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Box bg="blue.500" p={4} color="white">
            <Flex justify="space-between" align="center">
                <Link to="/">🏠 Home</Link>
                <Flex gap={4} align="center">
                    <Link to="/dashboard">
                        <Button colorScheme="teal">Dashboard</Button>
                    </Link>

                    {!user ? (
                        <Button onClick={() => handleGoogleSignIn(navigate)} colorScheme="yellow">
                            Sign in with Google
                        </Button>
                    ) : (
                        <>
                            {/* <Avatar src={user?.photoURL || ""} size="sm" /> */}
                            <Text>{user?.displayName}</Text>
                            <Button onClick={handleSignOut} colorScheme="red">
                                Sign Out
                            </Button>
                                <Link to="/add-property">
                                    <Button colorScheme="blue">Add Property</Button>
                                </Link>
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
