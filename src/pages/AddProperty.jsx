import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { Box, Button, Input, Textarea, VStack, Heading, Image, SimpleGrid, Text, Card, CardBody } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const IMGUR_CLIENT_ID = "6fe986d96cc8786";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
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
        <Box p={5} maxW="1200px" mx="auto">
            <Heading size="lg" mb={4}>List a New Property</Heading>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Input
                    placeholder="Property Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <Input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <Input type="file" accept="image/*" required />
                {imageUrl && <Image src={imageUrl} alt="Uploaded" boxSize="150px" />}
                <Button type="submit" colorScheme="blue" isLoading={loading}>Submit</Button>
            </VStack>

            <Heading size="lg" mt={10} mb={4}>All Properties</Heading>
            {Array.isArray(properties) && properties.length > 0 ? (
                <SimpleGrid columns={[1, 2, 3]} gap={5} height="600px">
                    {properties?.map((property) => (
                        <Box key={property.id} p={4} boxShadow="md" borderRadius="md">
                            {property.imageUrl && (
                                <Image
                                    src={property.imageUrl}
                                    alt={property.title}
                                    boxSize="200px"
                                    borderRadius="md"
                                />
                            )}
                            <Text fontWeight="bold" mt={2}>
                                {property.title}
                            </Text>
                            <Text>{property.description}</Text>
                            {property.price && <Text color="green.500">${property.price}</Text>}
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
