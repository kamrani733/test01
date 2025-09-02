import image1 from "@/assets/images/dummy.jpg";
import { StaticImageData } from "next/image";

export type ProductItem = {
  title: string;
  productType: string;
  colors: string[];
  price: number;
  image_info: {
    urls: StaticImageData[];
  };
};

export type ProductSection = {
  title: string;
  items: ProductItem[];
};

export const productFourthSection: ProductSection = {
  title: "پیشنهاد ما",
  items: [
    {
      title: "قاب",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 150,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "دکوری",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 200,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "بوفه",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 800,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "بوفه شیشه ای",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 650,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "قاب",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 150,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "دکوری",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 200,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "بوفه",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 800,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
    {
      title: "بوفه شیشه ای",
      productType: "چوب",
      colors: ["#C6B8A3", "#5E3E34", "#000000"],
      price: 650,
      image_info: {
        urls: [image1, image1, image1],
      },
    },
  ],
};
