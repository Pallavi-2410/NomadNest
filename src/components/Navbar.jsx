import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Text, Image, Heading } from "@chakra-ui/react";
import { handleGoogleSignIn, handleSignOut } from "../firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import NomadNestLogo from "../assets/Logo/NomadLogo.png"

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
        <Box p={2}>
            <Flex justify="space-between" align="center">
                <Link to="/dashboard"><Image width="120px" marginLeft="50px" p={2} src={NomadNestLogo} alt="NomadNestLogo"/></Link>

                <Flex gap={1} align="center">                  
                    {!user ? (
                        <Flex gap={5}>
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <Button onClick={() => handleGoogleSignIn(navigate)}>
                            Sign in with Google
                        </Button>
                        </Flex>
                    ) : (
                        <>
                            <Link to="/add-property">
                                <Button bg="transparent" color="black">Add Property</Button>
                                </Link>
                            <Text fontSize={"sm"}>{user?.displayName}</Text>
                            <Button onClick={handleSignOut} bg="transparent" color="black">
                                Sign Out
                            </Button>
                                
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
