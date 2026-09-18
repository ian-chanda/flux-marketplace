import * as Location from "expo-location";

export const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  console.log("checking for permission");

  if (status !== "granted") {
    return null;
  }

  console.log("permission granted");
  const location = await Location.getCurrentPositionAsync({});

  const addresses = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  console.log(JSON.stringify(addresses, null, 2));

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    city: addresses[0].city,
    country: addresses[0].country,
    district: addresses[0].district,
    countryCode: addresses[0].isoCountryCode,
    province: addresses[0].region,
  };
};
