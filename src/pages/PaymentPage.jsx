import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, Image, Heading } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays } from "date-fns";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve property details from location.state
    const { propertyId, checkIn, checkOut, guest, nights, pricePerNight, propertyImage, propertyTitle, propertyDescription } =
        location.state || {};

    if (!propertyId || !checkIn || !checkOut || !guest || !nights || !pricePerNight) {
        return (
            <Flex height="100vh" justifyContent="center" alignItems="center">
                <Text fontSize="lg" color="red.500">
                    Error: Missing details. Please go back and select all required information.
                </Text>
            </Flex>
        );
    }

    // Editable states
    const [selectedCheckIn, setSelectedCheckIn] = useState(new Date(checkIn));
    const [selectedCheckOut, setSelectedCheckOut] = useState(new Date(checkOut));
    const [isEditingDates, setIsEditingDates] = useState(false);
    const [isEditingGuests, setIsEditingGuests] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(guest);

    // Calculate updated nights dynamically
    const updatedNights = differenceInDays(selectedCheckOut, selectedCheckIn);

    // Format dates to "dd-MMM"
    const formattedCheckIn = selectedCheckIn ? format(selectedCheckIn, "dd-MMM") : "";
    const formattedCheckOut = selectedCheckOut ? format(selectedCheckOut, "dd-MMM") : "";

    // Pricing calculations
    const totalPrice = updatedNights * pricePerNight;
    const serviceFee = 5000;
    const grandTotal = totalPrice + serviceFee;

    return (
        <Box p={5} maxW="76%" mx="auto">
            <Heading size="lg" mb={4}>Confirm and Pay</Heading>

            <Flex justifyContent="space-between">
                {/* Left Section - Trip details */}
                <Box flex="1" pr={10}>
                    <Box border="1px solid gray" borderRadius={8} p={5} mb={5}>
                        <Text fontSize="lg" fontWeight="bold">Your trip</Text>

                        <Box mt={3}>
                            <Flex justify="space-between" align="center" my={4}>
                                <Text fontWeight="bold">Dates:</Text>
                                <Text>{formattedCheckIn} - {formattedCheckOut}</Text>
                                <Button size="sm" onClick={() => setIsEditingDates(!isEditingDates)}>Edit</Button>
                            </Flex>

                            {isEditingDates && (
                                <Box>
                                    <Text>Select Check-in Date:</Text>
                                    <DatePicker
                                        selected={selectedCheckIn}
                                        onChange={(date) => setSelectedCheckIn(date)}
                                        dateFormat="dd-MMM-yyyy"
                                        minDate={new Date()}
                                    />
                                    <Text>Select Check-out Date:</Text>
                                    <DatePicker
                                        selected={selectedCheckOut}
                                        onChange={(date) => setSelectedCheckOut(date)}
                                        dateFormat="dd-MMM-yyyy"
                                        minDate={selectedCheckIn}
                                    />
                                    <Button mt={2} onClick={() => setIsEditingDates(false)}>Save</Button>
                                </Box>
                            )}
                        </Box>

                        <hr style={{ margin: "20px 0" }} />

                        <Box>
                            <Flex justify="space-between" align="center" my={4}>
                                <Text fontWeight="bold">Guests:</Text>
                                {isEditingGuests ? (
                                    <Box>
                                        <select value={selectedGuest} onChange={(e) => setSelectedGuest(e.target.value)}>
                                            {[...Array(10).keys()].map(i => (
                                                <option key={i} value={i + 1}>{i + 1} guest</option>
                                            ))}
                                        </select>
                                        <Button size="sm" onClick={() => setIsEditingGuests(false)} ml={2}>
                                            Done
                                        </Button>
                                    </Box>
                                ) : (
                                    <Flex align="center">
                                        <Text>{selectedGuest} guest{selectedGuest > 1 ? "s" : ""}</Text>
                                        <Button size="sm" ml={2} onClick={() => setIsEditingGuests(true)}>
                                            Edit
                                        </Button>
                                    </Flex>
                                )}
                            </Flex>
                        </Box>
                    </Box>

                    {/* Payment Method */}
                    <Box border="1px solid gray" borderRadius={8} p={5} mb={5}>
                        <Text fontSize="lg" fontWeight="bold">Pay with</Text>
                        <select style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}>
                            <option value="upi">UPI</option>
                            <option value="credit-card">Credit Card</option>
                            <option value="debit-card">Debit Card</option>
                        </select>
                    </Box>

                    {/* Cancellation Policy */}
                    <Box border="1px solid gray" borderRadius={8} p={5} mb={5}>
                        <Text fontSize="lg" fontWeight="bold">Cancellation policy</Text>
                        <Text color="gray.600">
                            Free cancellation before 5 days of check-in. Get a full refund if you change your mind.
                        </Text>
                    </Box>
                </Box>

                {/* Right Section - Property details & Price details */}
                <Box maxW="40%" border="1px solid gray" borderRadius={8} p={5}>
                    {/* Property Image */}
                    <Image mb={5} src={propertyImage} alt={propertyTitle} boxSize={"250px"} borderRadius="10px" />

                    {/* Property Title & Description */}
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">{propertyTitle}</Text>
                        <Text fontSize="sm" color="gray.500" mb={2}>{propertyDescription}</Text>
                    </Box>

                    <hr style={{ margin: "20px 0" }} />

                    {/* Price details */}
                    <Box>
                        <Flex justify="space-between">
                            <Text>₹{pricePerNight} x {updatedNights} nights</Text>
                            <Text fontWeight="bold">₹{totalPrice}</Text>
                        </Flex>

                        <Flex justify="space-between" mt={2}>
                            <Text>Service Fee</Text>
                            <Text fontWeight="bold">₹{serviceFee}</Text>
                        </Flex>

                        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

                        <Flex justify="space-between">
                            <Text fontWeight="bold">Grand Total</Text>
                            <Text fontWeight="bold">₹{grandTotal}</Text>
                        </Flex>
                    </Box>

                    <Button
                        width="100%"
                        mt={4}
                        bg="#F44336"
                        color="white"
                        _hover={{ bg: "#D32F2F" }}
                        _active={{ bg: "#B71C1C" }}
                        onClick={() => navigate("/confirmation")}
                    >
                        Confirm and Pay
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
};

export default PaymentPage;
