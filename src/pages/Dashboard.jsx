import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Text, Flex, Heading, SimpleGrid, Input, Image } from "@chakra-ui/react";
import { LuSearch, LuBedDouble } from "react-icons/lu";
import { FaSwimmingPool, FaWater } from "react-icons/fa";
import { GiWindow, GiTreehouse } from "react-icons/gi";
import { TbBeach } from "react-icons/tb";
import { MdOutlineEmojiFoodBeverage } from "react-icons/md";
import { PiFarm } from "react-icons/pi";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [destination, setDestination] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

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
        <Box p={5} maxW="90%" mx="auto">
            {/* <Flex justify="space-between" mb={5}>
                <Heading size="lg">Stays</Heading>
                <Button bg="transparent" color="black" onClick={() => navigate("/add-property")}>
                    List a Property
                </Button>
            </Flex> */}

            {/* SearchBar */}

            <Flex gap={15} mb={6} p={3} height="80px" marginX={100} borderRadius="60px" border="1px solid" borderColor="gray.100" boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;">
                <Box marginTop={0.5} flex="1" marginLeft={4}>
                    <Text fontSize={"sm"}>Where</Text>
                    <Input
                        border={"none"}
                        placeholder="Search destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">
                    <Text fontSize={"sm"}>Dates</Text>
                    <Input
                        border={"none"}
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">                    
                    <Flex gap={2}>
                        <Box>
                            <Text fontSize="smaller">Adults</Text>
                            <Input
                                border={"none"}
                                type="number"
                                value={adults}
                                min="1"
                                onChange={(e) => setAdults(Number(e.target.value))}
                            />
                        </Box>
                        <Box >
                            <Text fontSize="smaller">Children</Text>
                            <Input
                                border={"none"}
                                type="number"
                                value={children}
                                min="0"
                                onChange={(e) => setChildren(Number(e.target.value))}
                            />
                        </Box>
                    </Flex>
                </Box>

                <Box alignSelf="center" >
                    <Button bg="Red" borderRadius="50px" ><LuSearch/>Search</Button>
                </Box>                
            </Flex>

            <Box as="hr" mb={4} border="1px solid gray.300" />



        {/* Second Nav */}
                <Box>
                <Flex gap={10} color={"gray.600"} fontWeight={"bold"} flexDirection={"columns"} m={[5, 0, 5, 10]}>
                    <Link to="/rooms" > <Flex align={"center"} gap={1}><LuBedDouble size={"20px"} /><Text fontSize={"xs"}>Rooms</Text></Flex> </Link>
                    <Link to="/lakefront"> <Flex align={"center"} gap={1}><FaWater size={"20px"} /> <Text fontSize={"xs"}>Lakefront</Text></Flex> </Link>
                    <Link to="/amazingview"> <Flex align={"center"} gap={1}><GiWindow size={"20px"} /> <Text fontSize={"xs"}>Amazing View</Text></Flex> </Link>
                    <Link to="/beachfront"> <Flex align={"center"} gap={1}><TbBeach size={"20px"} /> <Text fontSize={"xs"}>Beachfront</Text></Flex> </Link>
                    <Link to="/treehouses"> <Flex align={"center"} gap={1}><GiTreehouse size={"20px"} /> <Text fontSize={"xs"}>Treehouses</Text></Flex> </Link>
                    <Link to="/luxe"> <Flex align={"center"} gap={1}><MdOutlineEmojiFoodBeverage size={"20px"} /> <Text fontSize={"xs"}>Luxe</Text></Flex> </Link>
                    <Link to="/poolSideProperty"> <Flex align={"center"} gap={1}><FaSwimmingPool size={"20px"} /> <Text fontSize={"xs"}>Amazing pools</Text></Flex> </Link>
                    <Link to="/farms"> <Flex align={"center"} gap={1}><PiFarm size={"20px"} /> <Text fontSize={"xs"}>Farms</Text></Flex> </Link>
                    </Flex>
                </Box>
        
            {properties.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3]} gap={5} height="600px" >
                {properties.map((property) => (
                    <Box key={property.id} p={4} borderWidth="1px" borderRadius="md" >
                        <Image src={property.imageUrl}
                            alt={property.title}
                            boxSize="200px"
                            borderRadius="md" />
                        <Heading size="md">{property.title}</Heading>
                        <Text>{property.description}</Text>
                        <Text>Price: ${property.price}</Text>
                        <Link to={`/property/${property.id}`}>
                            <Button colorScheme="blue" mt={2}>View Details</Button>
                        </Link>
                    </Box>
                ))}
                </SimpleGrid>
            ) : (
                <Text>No properties found.</Text>
            )}
        </Box>
        
    );
};

export default Dashboard;
