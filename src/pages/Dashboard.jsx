import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Text, Flex, Heading } from "@chakra-ui/react";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "properties"));
                const propertyList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProperties(propertyList);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
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
        <Box p={5} maxW="800px" mx="auto">
            <Flex justify="space-between" mb={5}>
                <Heading size="lg">Dashboard</Heading>
                <Button colorScheme="green" onClick={() => navigate("/add-property")}>
                    List a Property
                </Button>
            </Flex>

            {properties.length > 0 ? (
                properties.map((property) => (
                    <Box key={property.id} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                        <Heading size="md">{property.title}</Heading>
                        <Text>{property.description}</Text>
                        <Text>Price: ${property.price}</Text>
                        <Link to={`/property/${property.id}`}>
                            <Button colorScheme="blue" mt={2}>View Details</Button>
                        </Link>
                    </Box>
                ))
            ) : (
                <Text>No properties found.</Text>
            )}
        </Box>
    );
};

export default Dashboard;
