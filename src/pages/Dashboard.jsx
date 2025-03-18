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
import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { useParams } from "react-router-dom";
import "../styles/styles.css"

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [destination, setDestination] = useState("");
    // const [selectedDate, setSelectedDate] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [sortOrder, setSortOrder] = useState("")
    const [filteredProperties, setFilteredProperties] = useState([]);


    // const navigate = useNavigate();

    const { category } = useParams();

    const filterByCategory = (properties, category) => {
        if (!category) return properties;

        return properties.filter(property =>
            (property.title && property.title.toLowerCase().includes(category.toLowerCase())) ||
            (property.description && property.description.toLowerCase().includes(category.toLowerCase()))
        );
    };

    const filteredByCategory = filterByCategory(filteredProperties.length > 0 ? filteredProperties : properties, category);

    console.log("Selected Category:", category);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const mergedProperties = [...new Set([...filteredProperties, ...filteredByCategory])];

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

    const handleSortChange = (event) => {
        const order = event.target.value;
        setSortOrder(order);

        const sortedProperties = [...mergedProperties].sort((a, b) => {
            if (order === "low-to-high") return a.price - b.price;
            if (order === "high-to-low") return b.price - a.price;
            return 0;
        });
        setFilteredProperties(sortedProperties);
    };


    const handleSearch = () => {
        console.log("Running search with: ", { destination, checkInDate, checkOutDate, adults, children });

        const checkIn = checkInDate ? new Date(checkInDate) : null;
        const checkOut = checkOutDate ? new Date(checkOutDate) : null;

        const searchResults = properties.filter(property => {
            const location = property.location ? property.location.toLowerCase() : "";
            const matchesLocation = !destination || location.includes(destination.toLowerCase());

            const propertyCheckIn = property.checkIn ? new Date(property.checkIn) : null;
            const propertyCheckOut = property.checkOut ? new Date(property.checkOut) : null;

            const matchesDate =
                (!checkIn || !checkOut) ||
                (propertyCheckIn && propertyCheckOut &&
                    propertyCheckIn <= checkIn &&
                    propertyCheckOut >= checkOut);

            const totalGuests = (adults || 0) + (children || 0);
            const maxGuests = property.maxGuests || Number.MAX_SAFE_INTEGER;
            const matchesGuests = totalGuests === 0 || totalGuests <= maxGuests;

            return matchesLocation && matchesDate && matchesGuests;
        });

        console.log("Filtered Properties: ", searchResults);

        setFilteredProperties(searchResults.length > 0 ? searchResults : properties);

        if (searchResults.length === 0) {
            alert("No property available for these dates.");
        }
        if (!destination && !checkInDate && !checkOutDate && adults === 0 && children === 0) {
            setFilteredProperties(properties);
            return;
        }
    };



    // if (!user) {
    //     return (
    //         <Box textAlign="center" mt={10}>
    //             <Heading size="lg">Please log in to access the dashboard</Heading>
    //             <Button mt={4} onClick={() => navigate("/login")}>Login</Button>
    //         </Box>
    //     );
    // }

    const formatDateRange = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "Dates not available";
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const options = { day: "numeric", month: "short" }; 
        return `${checkInDate.toLocaleDateString("en-GB", options)} – ${checkOutDate.toLocaleDateString("en-GB", options)}`;
    };

    return (
        <Box p={5} maxW="90%" mx="auto">

            {/* SearchBar */}

            <Flex gap={15} mb={6} p={3} height="80px" marginX={100} borderRadius="60px" border="1px solid" borderColor="gray.100" boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;">
                <Box marginTop={0.5} flex="1" marginLeft={4} >
                    <Text fontSize={"sm"} p="0px 0px 0px 20px">Where</Text>
                    <Input
                        p="0px 0px 0px 20px"
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        placeholder="Search destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">
                    <Text fontSize={"sm"} p="0px 0px 0px 12px">Check-In</Text>
                    <Input
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                    />
                </Box>
                <Box marginTop={0.5} flex="1">
                    <Text fontSize={"sm"} p="0px 0px 0px 12px">Check-Out</Text>
                    <Input
                        border={"none"}
                        _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                </Box>

                <Box marginTop={0.5} flex="1">
                    <Flex gap={2}>
                        <Box>
                            <Text fontSize="smaller" p="0px 0px 0px 12px">Adults</Text>
                            <Input
                                border={"none"}
                                _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                                type="number"
                                value={adults}
                                min="1"
                                onChange={(e) => setAdults(Number(e.target.value))}
                            />
                        </Box>
                        <Box >
                            <Text fontSize="smaller" p="0px 0px 0px 12px">Children</Text>
                            <Input
                                border={"none"}
                                _focus={{ border: "none", boxShadow: "none", outline: "none" }}
                                type="number"
                                value={children}
                                min="0"
                                onChange={(e) => setChildren(Number(e.target.value))}
                            />
                        </Box>
                    </Flex>
                </Box>

                <Box alignSelf="center" >
                    <Button bg="#F44336 " borderRadius="50px" color={"white"} border={"none"} onClick={handleSearch}><LuSearch />Search</Button>
                </Box>
            </Flex>

            <Box as="hr" mb={8} border="1px solid gray.300" />


            {/* Second Nav */}
            <Box>
                <Flex gap={10} color="gray.500" flexDirection="row" m="20px 0px 20px 40px"
                    height={"40px"} justifyContent={"center"}>
                    <Link to="/category/rooms">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <LuBedDouble size={"20px"} />
                            <Text fontSize="xs">Rooms</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/lakefront">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <FaWater size={"20px"} />
                            <Text fontSize="xs">Lakefront</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/amazingview">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <GiWindow size={"20px"} />
                            <Text fontSize="xs">Amazing View</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/beachfront">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <TbBeach size={"20px"} />
                            <Text fontSize="xs">Beachfront</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/treehouses">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <GiTreehouse size={"20px"} />
                            <Text fontSize="xs">Treehouses</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/luxe">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <MdOutlineEmojiFoodBeverage size={"20px"} />
                            <Text fontSize="xs">Luxe</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/poolSideProperty">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <FaSwimmingPool size={"20px"} />
                            <Text fontSize="xs">Amazing pools</Text>
                        </Flex>
                    </Link>
                    <Link to="/category/farms">
                        <Flex direction="column" align="center" justify="center" _hover={{
                            color: "black",
                            borderBottom: "2px solid black"
                        }}>
                            <PiFarm size={"20px"} />
                            <Text fontSize="xs">Farms</Text>
                        </Flex>
                    </Link>

                    
                    {/* <label For="">Sort by Price</label> */}
                    <select style={{ border: "1px solid gray", width: "200px", borderRadius: "5px", padding: "5px", fontSize: "small" }} onChange={handleSortChange} value={sortOrder} placeholder="Sort by Price">
                        <option value="">Sort by Price</option>
                        <option value="low-to-high"> <GoSortAsc /> Low to High</option>
                        <option value="high-to-low"> <GoSortDesc />High to Low</option>
                    </select>
                </Flex>
            </Box>


            {mergedProperties.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3, 4]} gap={5} height="600px">
                    {mergedProperties.map((property) => (
                        <Box key={property.id} p={4} borderWidth="1px" borderRadius="md">
                            <Image
                                src={property.imageUrl}
                                alt={property.title}
                                // boxSize="200px"
                                height="200px" width="300px"
                                borderRadius="md"
                            />
                            <Heading size="md">{property.title}</Heading>
                            <Text>{property.location}</Text>
                            <Text style={{ fontSize: "15px", color: "gray" }}>{formatDateRange(property.checkIn, property.checkOut)}</Text>
                            <Text style={{ fontSize: "15px" }}>Price: &#8377;{property.price} <span style={{ fontSize: "small" }}>night</span></Text>
                            <Link to={`/property/${property.id}`}>
                                <Button mt={2}>View Details</Button>
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
