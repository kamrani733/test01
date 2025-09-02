// import { Dispatch, SetStateAction, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMap,
//   useMapEvents,
// } from "react-leaflet";
// import L, { LatLngTuple, LeafletMouseEvent } from "leaflet";
// import { Button } from "@/components/ui/button";
// import { MapPin, LocateFixed } from "lucide-react";
// import { getAddress } from "@/core/lib/api/reverseGeocode";
// import { handleGetCurrentLocation } from "@/utils/location";
// import "leaflet/dist/leaflet.css";
// import { useAddressStore } from "@/stores";

// const customIcon = new L.Icon({
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// export default function LocationPicker({
//   setOpen,
// }: {
//   setOpen: Dispatch<SetStateAction<boolean>>;
// }) {
//   const [position, setPosition] = useState<LatLngTuple>([36.2976, 59.5671]);
//   const [address, setAddress] = useState<string>("مشهد، میدان آزادی");
//   const { setSelectedAddress, setSelectedLocation } = useAddressStore();

//   const setLocationAndAddress = async (lat: number, lng: number) => {
//     setPosition([lat, lng]);
//     const fetchedAddress = await getAddress(lat, lng, "fa");
//     setAddress(fetchedAddress);
//     setSelectedAddress(fetchedAddress);
//     setSelectedLocation({ lat, lon: lng });
//   };

//   const handleGetLocationClick = () => {
//     handleGetCurrentLocation(setLocationAndAddress);
//   };

//   const handleConfirmLocation = () => {
//     setOpen(false);
//   };

//   const LocationMarker = () => {
//     useMapEvents({
//       click: (e: LeafletMouseEvent) => {
//         const { lat, lng } = e.latlng;
//         setLocationAndAddress(lat, lng);
//       },
//     });
//     return <Marker position={position} icon={customIcon} />;
//   };

//   const MapCenter = () => {
//     const map = useMap();
//     map.setView(position, 14);
//     return null;
//   };

//   return (
//     <div className="w-full h-[19rem] relative">
//       <MapContainer
//         center={position}
//         zoom={12}
//         className="h-full w-full"
//         style={{ zIndex: 0 }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <LocationMarker />
//         <MapCenter />
//       </MapContainer>

//       <Button
//         variant={"secondary"}
//         className="absolute flex items-center justify-center gap-x-1 top-10 right-5 h-8 z-[1000] px-2 hover:bg-primary-0"
//         onClick={handleGetLocationClick}
//       >
//         <LocateFixed className="text-primary-600 w-4 h-4" />
//         <span className="text-primary-600">موقعیت من</span>
//       </Button>

//       {address && (
//         <div className="flex items-center gap-x-1 bg-primary-0 shadow-md rounded-sm p-2 absolute bottom-16 right-4 left-4 select-none">
//           <MapPin className="text-primary-600 w-4 h-4" />
//           <p className="text-primary-600">{address}</p>
//         </div>
//       )}

//       <Button
//         onClick={handleConfirmLocation}
//         className="absolute bottom-4 right-1/2 translate-x-1/2 hover:bg-primary-900"
//       >
//         ثبت موقعیت
//       </Button>
//     </div>
//   );
// }
