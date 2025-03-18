import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import "../styles/styles.css"

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Signup successful");
            navigate("/dashboard");
        }catch(err) {
            console.error("Signup Error:", err.message);
            setError("Error creating account, Try again")
        }
    }

    return (
        <Box maxW={"500px"} mx={"auto"} mt={"100px"} p={5} border={"1px solid"} borderColor={"gray.300"} borderRadius={8}>
            <Heading>Sign Up</Heading>
            {error && <Text>{error}</Text>}
            <Input placeholder='Enter email' mb={3} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder='Enter password' type='password' mb={3} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleSignUp}>Sign Up</Button>
            <Text>Already have an account ? <Button varient="link" onClick={() => navigate("/login")}>Login</Button></Text>
        </Box>
    )
}

export default Signup
