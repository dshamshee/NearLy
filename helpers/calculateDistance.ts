const R = 6371;
const TO_RAD = Math.PI / 180;

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // 1. Calculate differences
  const dLat = (lat2 - lat1) * TO_RAD;
  const dLon = (lon2 - lon1) * TO_RAD;

  // 2. Haversine logic
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // 3. Return formatted distance (optional: round to 2 decimal places)
  return Math.round(distance * 100) / 100; 
};


// get full address from latitude and longitude using google maps api
export const reverseGeocode = async (latitude: number, longitude: number) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      // The first result is usually the most specific address
      return data.results[0].formatted_address;
    } else {
      console.error("Geocoding failed:", data.status);
      return "Address not found";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};


export const formatDistance = (km: number): string => {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters}m away`;
  }
  return `${km.toFixed(2)}km away`;
};


export const convertToMeters = (distance: number): number =>{
  return distance * 1000;
}