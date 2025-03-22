// import React, { useState } from "react";
// import { Box, Button, Input} from "@chakra-ui/react";

// const SearchComponent = ({ properties }) => {
//     const [destination, setDestination] = useState("");
//     const [checkInDate, setCheckInDate] = useState("");
//     const [checkOutDate, setCheckOutDate] = useState("");
//     const [adults, setAdults] = useState(0);
//     const [children, setChildren] = useState(0);
//     const [category, setCategory] = useState("");
//     const [sortOrder, setSortOrder] = useState("");
//     const [searchResults, setSearchResults] = useState([]);

//     const handleSearch = () => {
//         console.log("Running search with: ", { destination, checkInDate, checkOutDate, adults, children });

//         let searchResults = properties.filter(property => {
//             const matchesLocation = !destination || property.location?.toLowerCase().includes(destination.toLowerCase());

//             const checkIn = checkInDate ? new Date(checkInDate) : null;
//             const checkOut = checkOutDate ? new Date(checkOutDate) : null;
//             const propertyCheckIn = property.checkIn ? new Date(property.checkIn) : null;
//             const propertyCheckOut = property.checkOut ? new Date(property.checkOut) : null;
//             const matchesDate = (!checkIn || !checkOut) || (propertyCheckIn && propertyCheckOut && propertyCheckIn <= checkIn && propertyCheckOut >= checkOut);

//             const totalGuests = (adults || 0) + (children || 0);
//             const matchesGuests = totalGuests === 0 || totalGuests <= (property.maxGuests || Number.MAX_SAFE_INTEGER);

//             return matchesLocation && matchesDate && matchesGuests;
//         });

//         // Apply Category Filter
//         if (category) {
//             searchResults = searchResults.filter(property =>
//                 property.title?.toLowerCase().includes(category.toLowerCase()) ||
//                 property.description?.toLowerCase().includes(category.toLowerCase())
//             );
//         }

//         // Apply Sorting
//         if (sortOrder === "low-to-high") {
//             searchResults.sort((a, b) => a.price - b.price);
//         } else if (sortOrder === "high-to-low") {
//             searchResults.sort((a, b) => b.price - a.price);
//         }

//         if (searchResults.length === 0) {
//             alert("No property available for these filters.");
//         }

//         setSearchResults(searchResults);
//     };

//     return (
//         <Box>
//             <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
//             <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
//             <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
//             <Input type="number" placeholder="Adults" value={adults} onChange={(e) => setAdults(parseInt(e.target.value) || 0)} />
//             <Input type="number" placeholder="Children" value={children} onChange={(e) => setChildren(parseInt(e.target.value) || 0)} />
//             <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
//             <select placeholder="Sort by" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//                 <option value="low-to-high">Price: Low to High</option>
//                 <option value="high-to-low">Price: High to Low</option>
//             </select>
//             <Button onClick={handleSearch}>Search</Button>
//         </Box>
//     );
// };

// export default SearchComponent;
