import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

const faq = [
  {
    question: "How do I book a room?",
    answer:
      "Find the room you're interested in using the search or browsing the available rooms section. Click 'Book Now', fill in the required details (title, description, start/end times), and submit your request. You'll be notified once an administrator approves it.",
  },
  {
    question: "Can I see if a room is available before booking?",
    answer:
      "Yes, our platform shows real-time availability. You can browse rooms and check their calendars to see open time slots before initiating a booking request.",
  },
  {
    question: "Is there a limit to how many reservations I can request?",
    answer:
      "Yes, there is a limit on the number of pending reservations you can have per room to ensure fair usage. You will see a notification if you reach this limit.",
  },
  {
    question: "How will I know if my reservation is approved?",
    answer:
      "Once an administrator reviews and approves your reservation request, you will receive a notification confirming your booking details.",
  },
  {
    question: "Can I modify or cancel my reservation request?",
    answer:
      "Currently, modification or cancellation after submission needs to be handled by contacting an administrator. Functionality to manage requests directly may be added in the future.",
  },
  {
    question: "What information do I need to provide?",
    answer:
      "You'll need to provide a title for your meeting/event, an optional description, and the specific start and end date/time for your reservation.",
  },
];

export function FAQ() {
  return (
    <div id="faq" className="w-full max-w-screen-xl mx-auto py-8 xs:py-16 px-6">
      <h2 className="md:text-center text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
        Frequently Asked Questions
      </h2>
      <p className="mt-1.5 md:text-center xs:text-lg text-muted-foreground">
        Quick answers to common questions about booking rooms.
      </p>

      <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
        <Accordion
          type="single"
          collapsible
          className="mt-8 space-y-4 md:columns-2 gap-4"
        >
          {faq.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index}`}
              className="bg-accent py-1 px-4 rounded-xl border-none !mt-0 !mb-4 break-inside-avoid"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                    "text-start text-lg"
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-[15px]">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
