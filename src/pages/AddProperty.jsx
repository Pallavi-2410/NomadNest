import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Box, Button, Input, Textarea, VStack, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const IMGUR_CLIENT_ID = "6fe986d96cc8786";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const navigate = useNavigate();

    console.log(properties, "properties")

    // Upload image to Imgur API
    const uploadImageToImgur = async (file) => {
        if (!file) return "";

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.link; // Return the Imgur image URL
            } else {
                throw new Error("Image upload failed");
            }
        } catch (error) {
            console.error("Error uploading image to Imgur:", error);
            return "";
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fileInput = e.target.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            const uploadedImageUrl = await uploadImageToImgur(file);
            setImageUrl(uploadedImageUrl);

            // Add property details to Firestore
            await addDoc(collection(db, "properties"), {
                title,
                description,
                price,
                location,
                checkIn,
                checkOut,
                adults,
                children,
                imageUrl: uploadedImageUrl,
                createdAt: serverTimestamp(),
            });

            alert("Property added successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding property:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch properties from Firestore
    const fetchProperties = async () => {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propertyList);
    };

    useEffect(() => {
        fetchProperties();
    }, []);



    return (
        <Box p={5} maxW="80%" mx="auto">
            <Heading size="lg" mb={6} textAlign="center">List a New Property</Heading>
            <VStack as="form" onSubmit={handleSubmit} spacing={4} margin={"auto"} p={5} boxShadow="md" borderRadius="md" maxW={"60%"}>

                <Box w="full" mb={2}>
                    <Text mb={1}>Property Title</Text>
                    <Input placeholder="Enter property title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Location</Text>
                    <Input placeholder="Enter location (City, Country)" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Check-in Date</Text>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Check-out Date</Text>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Guests</Text>
                    <Box display="flex" gap={3}>
                        <Box flex="1">
                            <Text fontSize="sm" mb={1}>Adults</Text>
                            <select value={adults} onChange={(e) => setAdults(e.target.value)} required
                                style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <option value="">Select Adults</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </Box>

                        <Box flex="1" mb={2}>
                            <Text fontSize="sm" mb={1}>Children</Text>
                            <select value={children} onChange={(e) => setChildren(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
                                <option value="">Select Children</option>
                                {[...Array(10).keys()].map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </Box>
                    </Box>
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Price Per Night (&#8377;)</Text>
                    <Input type="number" min="0" placeholder="Enter price per night" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Description</Text>
                    <Textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Box>

                <Box w="full" mb={2}>
                    <Text mb={1}>Upload Property Image</Text>
                    <Input type="file" accept="image/*" required />
                    {imageUrl && <Image src={imageUrl} alt="Uploaded" boxSize="150px" mt={2} />}
                </Box>

                <Button type="submit" color={"white"} bgColor={"#F44336"} borderRadius={8} isLoading={loading} w="full">Submit</Button>
            </VStack>

            <Heading size="lg" mt={10} mb={4} textAlign="left">All Properties</Heading>
            {Array.isArray(properties) && properties.length > 0 ? (
                <SimpleGrid columns={[1, 2,3,4]} gap={5}>
                    {properties?.map((property) => (
                        <Box key={property.id} p={4} boxShadow="md" borderRadius="md">
                            {property.imageUrl && (
                                <Image src={property.imageUrl} alt={property.title} height="200px" width="300px" borderRadius="md" />
                            )}
                            <Text fontWeight="bold" mt={2}>{property.title}</Text>
                            <Text>{property.location}</Text>
                            <Text>Check-in: {property.checkIn} | Check-out: {property.checkOut}</Text>
                            <Text>Adults: {property.adults} | Children: {property.children}</Text>
                            <Text color="green.500">${property.price} per night</Text>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No properties found</Text>
            )}
        </Box>
    );
};


export default AddProperty;
