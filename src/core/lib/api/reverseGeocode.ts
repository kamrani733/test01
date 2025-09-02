import axios from "axios";

export const getAddress = async (
  lat: number,
  lng: number,
  lang: "fa" | "en" = "fa"
): Promise<string> => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon: lng,
          "accept-language": lang,
        },
      }
    );

    const data = response.data;

    if (!data?.address)
      return lang === "fa" ? "آدرس یافت نشد" : "Address not found";

    const parts = [
      data.address.state,
      data.address.county,
      data.address.city,
      data.address.suburb,
      data.address.neighbourhood,
      data.address.road,
      data.address.name,
    ].filter(Boolean);

    return parts.length
      ? parts.join(lang === "fa" ? "، " : ", ")
      : lang === "fa"
      ? "آدرس یافت نشد"
      : "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return lang === "fa" ? "خطا در دریافت آدرس" : "Error fetching address";
  }
};

export const fetchAddress = async (
  lat: number,
  lng: number,
  setAddress: (addr: string) => void
): Promise<void> => {
  const addr = await getAddress(lat, lng);
  setAddress(addr);
};
