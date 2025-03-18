import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Box, Heading, Text, Spinner, Image, VStack, Card, Flex } from "@chakra-ui/react";
import { auth } from "../firebase/firebaseConfig";
// import image1 from "../assets/HostImages/image1"

const PropertyDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

  console.log(user, "user")

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Heading size="lg" mb={4}>{property.title}</Heading>
      <Image src={property.imageUrl} alt={property.title} boxSize="200px" borderRadius="md" />
      
      <Text fontSize="lg">{property.description}</Text>
      <Text>{"Adults - " + property.adults + ", " + "Childrens - " + property.children}</Text>
      <Text fontSize="xl" fontWeight="bold" mt={2}>Price: ${property.price}</Text>

      <hr style={{marginTop:"25px", marginBottom:"25px", }} />

      <Text fontSize={"m"} fontWeight={"bold"}>Hosted by {auth.currentUser?.displayName ? auth.currentUser.displayName : "No user"}</Text>

      
    </Box>
  );
};

export default PropertyDetails;
