import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Box, Heading, Text, Spinner, Image } from "@chakra-ui/react";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty(docSnap.data());
        } else {
          console.log("No such property!");
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <Spinner size="xl" />;

  if (!property) return <Text>No property found.</Text>;

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Image src={property.imageUrl}  alt={property.title} boxSize="200px" borderRadius="md" />
      <Heading size="lg" mb={4}>{property.title}</Heading>
      <Text fontSize="lg">{property.description}</Text>
      <Text fontSize="xl" fontWeight="bold" mt={2}>Price: ${property.price}</Text>
    </Box>
  );
};

export default PropertyDetails;
