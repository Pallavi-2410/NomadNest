import React, { useState, useEffect } from "react";
import { Box, Image, Text, VStack, IconButton, HStack } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { db } from "../firebaseConfig"; // Import Firestore
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const PropertyCard = ({ property, userId }) => {
    const [liked, setLiked] = useState(false);

    // Firestore document reference
    const likeDocRef = doc(db, "likes", `${userId}_${property.id}`);

    useEffect(() => {
        // Check if the property is already liked
        const fetchLikeStatus = async () => {
            const docSnap = await getDoc(likeDocRef);
            if (docSnap.exists()) {
                setLiked(true);
            }
        };
        fetchLikeStatus();
    }, [likeDocRef]);

    const toggleLike = async () => {
        if (liked) {
            await deleteDoc(likeDocRef); // Remove from Firestore
        } else {
            await setDoc(likeDocRef, { userId, propertyId: property.id });
        }
        setLiked(!liked);
    };

    return (
        <Box border="1px solid lightgray" p={4} borderRadius="lg" boxShadow="md">
            <Image src={property.imageURL} alt={property.name} borderRadius="md" />
            <VStack align="start" mt={3} spacing={2}>
                <HStack justifyContent="space-between" width="100%">
                    <Text fontSize="lg" fontWeight="bold">
                        {property.name}
                    </Text>
                    {/* Like Button */}
                    <IconButton
                        aria-label="Like Property"
                        icon={liked ? <FaHeart color="red" /> : <FaRegHeart />}
                        onClick={toggleLike}
                        variant="ghost"
                        size="lg"
                    />
                </HStack>
                <Text color="gray.600">{property.location}</Text>
                <Text fontWeight="bold">${property.price} / night</Text>
            </VStack>
        </Box>
    );
};

export default PropertyCard;
