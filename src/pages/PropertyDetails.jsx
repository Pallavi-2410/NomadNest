import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Box, Flex, Text, Spinner, Button, Heading, Image, HStack, VStack, Grid, Link } from "@chakra-ui/react";
import { auth } from "../firebase/firebaseConfig";
import "../styles/styles.css"
import { LuMapPinCheckInside } from "react-icons/lu";
import { MdOutlineFreeCancellation } from "react-icons/md";
import { MdOutlineAcUnit } from "react-icons/md";
import oliveright from "../assets/HostImages/olive-right.png"
import oliveleft from "../assets/HostImages/olive-left.png"


const PropertyDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guest, setGuest] = useState(1);
  const [nights, setNights] = useState(0);

  const navigate = useNavigate();

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
          setProperty({ id: docSnap.id, ...propertyData });
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


  console.log("property", property)
  return (
    <Box p={5} maxW="76%" mx="auto">
      
    <Box>
      <Heading textAlign={"center"} size="lg" mb={4}>{property.title}</Heading>

        <Image mb={5} src={property.imageUrl} alt={property.title} boxSize={"600px"} mx={"auto"} borderRadius="10px"  />

      <Text fontSize="lg" m={3}>{property.description}</Text>
        <Text fontSize="md" m={3}>Adults - {property.adults}, Children - {property.children}</Text>
        <Text m={3} fontSize="xl" fontWeight="bold">Price: ₹{property.price} /night</Text>

      <hr style={{ marginTop: "30px", marginBottom: "30px", }} />

      <Text fontSize={"m"} fontWeight={"bold"} m={3}>Hosted by {auth.currentUser?.displayName ? auth.currentUser.displayName : "No user"}</Text>
    </Box>

    <Flex maxW={"100%"} justifyContent={"center"}>
      <Box>
        <HStack border={"1px solid"} borderColor={"gray.300"} p={6} borderRadius={10} width={"85%"} justifyContent={"space-evenly"}>
            <Text fontWeight="bold" fontSize="large" display="flex" alignItems="center" gap={2}>
              <img src={oliveleft} alt="oliveleft" style={{ width: "25px"}} />
              Guest favourite
              <img src={oliveright} alt="oliveRight" style={{ width: "25px"}} />
            </Text>
            <Box height="30px" width="1px" bg="gray.300" mx={3} />
          <Text>4.9 </Text>
            <Box height="30px" width="1px" bg="gray.300" mx={3} />
            <Text>30 <span style={{fontSize:"12px"}}>Reviews</span></Text>
        </HStack>
          <hr style={{ marginTop: "30px", marginBottom: "30px", width:"85%" }}/>

          <VStack alignItems={"left"} fontSize={"14px"}>
            {/* Check-in Experience */}
            <Heading fontSize={"17px"} mb={-2} display={"flex"} alignItems={"center"} gap={5}>
              <Box fontSize={"30px"}>
                <LuMapPinCheckInside />
              </Box>
              <Box>
                Great check-in experience
                <Text mb={2} color={"gray.600"} fontWeight={"normal"} fontSize={"md"}>Recent guests loved the smooth start to this stay.</Text>
              </Box>
            </Heading>

            {/* Free Cancellation */}
            <Heading fontSize={"17px"} mb={-2} display={"flex"} alignItems={"center"} gap={5}>
              <Box fontSize={"30px"}>
                <MdOutlineFreeCancellation />
              </Box>
              <Box>
                Free cancellation before 5 days of Check-In
                <Text mb={2} color={"gray.600"} fontWeight={"normal"} fontSize={"md"}>Get a full refund if you change your mind.</Text>
              </Box>
            </Heading>

            {/* Staying Cool */}
            <Heading fontSize={"17px"} mb={-2} display={"flex"} alignItems={"center"} gap={5}>
              <Box fontSize={"30px"}>
                <MdOutlineAcUnit />
              </Box>
              <Box>
                Designed for staying cool
                <Text mb={2} color={"gray.600"} fontWeight={"normal"} fontSize={"md"}>Beat the heat with the A/C and ceiling fan.</Text>
              </Box>
            </Heading>
          </VStack>

          <hr style={{ marginTop: "30px", marginBottom: "30px", width: "85%" }} />

          <Text maxW={"90%"} lineHeight={"25px"}>The property is located at the most prime location with all the amenities available.
            You will find yourself cradled in the midst of Hills, Valleys and springs in a wooded environment.
            My place is good for couples, solo adventurers, and families, and particularly those wishing for a long stay.
            All the villas are self catering.
          </Text>

      </Box>


{/* Card */}
    <Box maxW={"40%"} p={5} mt={6} boxShadow="md" borderRadius={8} m={"auto"}>
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          ₹{property.price} <span style={{ fontSize: "18px", fontWeight: "normal" }}>night</span>
        </Text>
      </Flex>

      <Box mt={3} p={3} border="1px solid gray" borderRadius={8}>
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
      
          <Box textAlign="center" mt={4}>
            <Button
              width="100%"
              maxW="500px"
              bg="#F44336"
              color="white"
              _hover={{ bg: "#D32F2F" }}
              _active={{ bg: "#B71C1C" }}
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                if (property.id) {
                  navigate(`/payment`, {
                    state: {
                      checkIn,
                      checkOut,
                      guest,
                      nights,
                      pricePerNight: property.price,
                      propertyId: property.id,
                      propertyTitle: property.title,
                      propertyLocation: property.location,
                      propertyDescription: property.description,
                      propertyImage: property.imageUrl,
                    },
                  });
                }
              }}
            >
              Reserve
            </Button>
          </Box>
          

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
      </Flex>
    </Box>
  );
};

export default PropertyDetails;
