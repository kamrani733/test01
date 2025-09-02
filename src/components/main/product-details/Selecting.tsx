"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type City = {
  id: number;
  name: string;
};

const cities: City[] = [
  { id: 1, name: "تهران" },
  { id: 2, name: "مشهد" },
  { id: 3, name: "شیراز" },
];

export default function Selecting() {
  const [selectedCity, setSelectedCity] = useState<string>("");

  return (
    <Select onValueChange={setSelectedCity} value={selectedCity}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="انتخاب شهر" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={String(city.id)}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
