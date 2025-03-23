import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Text, Image, Heading } from "@chakra-ui/react";
import { handleGoogleSignIn, handleSignOut } from "../firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import NomadNestLogo from "../assets/Logo/NomadLogo.png"
import "../styles/styles.css"
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
    const [user, setUser] = useState("");
    const [filteredProperties, setFilteredProperties] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    //         setUser(currentUser);
    //     });
    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                await currentUser.reload(); // Ensure we get updated user info
                setUser(auth.currentUser);  // Fetch the latest user details
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);


    return (
        <Box p={2}>
            <Flex justify="space-between" align="center">
                <Link to="/" onClick={() => setFilteredProperties(properties)}><Image width="120px" marginLeft="50px" p={2} src={NomadNestLogo} alt="NomadNestLogo" /></Link>

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
                            <Link to="/host">
                                <Button bg="transparent" color="black">Add Property</Button>
                            </Link>

                            <Flex fontSize={"sm"} borderRadius={8} p={"9px"} m={3} border={"1px solid"} borderColor={"gray.200"} _hover={{ boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px;" }} fontWeight={"medium"} align={"center"} gap={2}>
                                <FaRegUser />
                                <Text >{user?.displayName}</Text>
                            </Flex>

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
