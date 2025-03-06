import React, { useState } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Box, Button, Input, Textarea, VStack, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = "";
            if (image) {
                const imageRef = ref(storage, `property-images/${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, "properties"), {
                title,
                description,
                price,
                imageUrl,
                createdAt: serverTimestamp(),
            });

            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding property:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={5} maxW="600px" mx="auto">
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
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                <Button type="submit" colorScheme="blue" isLoading={loading}>Submit</Button>
            </VStack>
        </Box>
    );
};

export default AddProperty;
