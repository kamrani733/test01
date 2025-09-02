import { toast } from "sonner";

// Function to get the user's current location and update state
export const handleGetCurrentLocation = (
  setLocationAndAddress: (lat: number, lng: number) => void
): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationAndAddress(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location: ", error);
        toast.error(error.message);
      }
    );
  } else {
    toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
  }
};
