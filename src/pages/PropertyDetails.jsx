import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Box, Flex, Text, Spinner, Button, Heading, Image } from "@chakra-ui/react";
import { auth } from "../firebase/firebaseConfig";

const PropertyDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guest, setGuest] = useState(1);
  const [nights, setNights] = useState(0);

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
          const propertyData = docSnap.data();
          setProperty(propertyData);
          setCheckIn(propertyData.checkIn || "");
          setCheckOut(propertyData.checkOut || "");
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

  useEffect(() => {
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      if (!isNaN(startDate) && !isNaN(endDate) && endDate > startDate) {
        const diffTime = endDate - startDate;
        setNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      } else {
        setNights(0);
      }
    }
  }, [checkIn, checkOut]);

  if (loading)
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );

  if (!property) return <Text>No property found.</Text>;

  const totalPrice = nights * property.price;
  const serviceFee = 5000;
  const grandTotal = totalPrice + serviceFee;

  return (
    <Box>
    <Box p={5} maxW="700px" mx="auto">
      <Heading size="lg" mb={4}>{property.title}</Heading>
      <Image src={property.imageUrl} alt={property.title} boxSize="300px" borderRadius="md" />

      <Text fontSize="lg" mt={3}>{property.description}</Text>
      <Text fontSize="md">Adults - {property.adults}, Children - {property.children}</Text>
      <Text fontSize="xl" fontWeight="bold" mt={2}>Price: ₹{property.price} /night</Text>

      <hr style={{ marginTop: "25px", marginBottom: "25px", }} />

      <Text fontSize={"m"} fontWeight={"bold"}>Hosted by {auth.currentUser?.displayName ? auth.currentUser.displayName : "No user"}</Text>
    </Box>

    <Box maxW={"40%"} p={5} mt={6} boxShadow="md" borderRadius="lg" m={"auto"}>
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          ₹{property.price} <span style={{ fontSize: "18px", fontWeight: "normal" }}>night</span>
        </Text>
      </Flex>

      <Box mt={3} p={3} border="1px solid gray" borderRadius="md">
        {/* Check-in & Check-out Date Selection */}
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="xs" fontWeight="bold">CHECK-IN</Text>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={property.checkIn}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Box>

          <Box height="40px" width="1px" bg="gray.300" mx={3} />

          <Box>
            <Text fontSize="xs" fontWeight="bold">CHECKOUT</Text>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || property.checkIn}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Box>
        </Flex>

        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

        {/* Guests Selection */}
        <Text fontSize="xs" fontWeight="bold">GUESTS</Text>
        <select
          value={guest}
          onChange={(e) => setGuest(parseInt(e.target.value))}
          style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          {[...Array(10).keys()].map(i => (
            <option key={i} value={i + 1}>{i + 1} guest</option>
          ))}
        </select>
      </Box>

      <Button mt={4} width="100%" colorScheme="pink" fontSize="lg">Reserve</Button>

      <Text fontSize="sm" color="gray.500" mt={2}>You won't be charged yet</Text>

      {/* Price Breakdown */}
      {nights > 0 && (
        <>
          <Flex justify="space-between" mt={3}>
            <Text>₹{property.price} x {nights} nights</Text>
            <Text fontWeight="bold">₹{totalPrice}</Text>
          </Flex>

          <Flex justify="space-between" mt={2}>
            <Text>NomadNest Service Fee</Text>
            <Text fontWeight="bold">₹{serviceFee}</Text>
          </Flex>

          <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

          <Flex justify="space-between">
            <Text fontWeight="bold">Grand Total</Text>
            <Text fontWeight="bold">₹{grandTotal}</Text>
          </Flex>
        </>
      )}
    </Box>
    </Box>
  );
};

export default PropertyDetails;
