"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function SupportInformation({ items }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem value={item.title} key={item.title}>
          <AccordionTrigger className="hover:no-underline cursor-pointer">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-primary-600">
            <p className="mb-4">{item.description}</p>
            {item.link && item.buttonContent && (
              <Button asChild variant="secondary">
                <Link href={item.link}>{item.buttonContent}</Link>
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
