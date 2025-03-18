import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import "../styles/styles.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try{
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/dashboard")
    }catch(err) {
      console.error("Login Error:", err.message);
      setError("Invalid email or password");
    }
  }
  return (
    <Box maxW={"500px"} mx={"auto"} mt={"100px"} p={5} border={"1px solid"} borderColor={"gray.300"} borderRadius={8} >
      <Heading>Login</Heading>
      {error && <Text>{error}</Text>}
      <Input placeholder='Enter email' mb={3} value={email} onChange={(e) => setEmail(e.target.value)}/>
      <Input placeholder='Enter password' type='password' mb={3} value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button onClick={handleLogin}>Login</Button>
      <Text>New user ? <Button varient="link" onClick={() => navigate("/signup")}>SignUp</Button></Text>
    </Box>
  )
}

export default Login
