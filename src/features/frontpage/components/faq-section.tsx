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
    question: "Gimana cara booking ruang meeting kantor?",
    answer:
      "Cari ruang meeting yang cocok lewat search atau browse di bagian ruang tersedia. Klik 'Book Now', isi detail meeting tim kamu (judul, deskripsi, waktu mulai/selesai), terus submit request. Admin kantor bakal review dan kasih tahu kalau sudah approve! 📝",
  },
  {
    question: "Bisa cek ketersediaan ruang kantor sebelum booking nggak?",
    answer:
      "Tentu saja! Sistem internal kami nampilin ketersediaan real-time semua ruang meeting kantor. Tim kamu bisa browse dan cek kalender untuk lihat slot waktu yang available sebelum bikin booking request.",
  },
  {
    question: "Ada batasan berapa banyak reservasi yang bisa direquest tim?",
    answer:
      "Iya, ada limit jumlah pending reservations per ruang buat memastikan fair usage untuk semua tim di kantor. Kamu bakal dapat notifikasi kalau udah reach limit ini.",
  },
  {
    question: "Gimana tau kalau reservasi meeting tim gue di-approve?",
    answer:
      "Begitu admin kantor review dan approve request reservasi tim kamu, langsung dapat notifikasi yang confirm detail booking meeting kok! Tim kamu siap kolaborasi! 🔔",
  },
  {
    question: "Bisa modify atau cancel request reservasi meeting nggak?",
    answer:
      "Saat ini, modifikasi atau pembatalan meeting setelah submit perlu hubungi admin kantor dulu. Tapi fitur untuk manage request langsung mungkin bakal ditambah di update sistem mendatang!",
  },
  {
    question: "Info apa aja yang perlu diisi untuk booking meeting?",
    answer:
      "Tim kamu perlu kasih judul untuk meeting/diskusi, deskripsi agenda (optional), dan waktu mulai plus selesai yang spesifik untuk sesi kolaborasi tim.",
  },
];

export function FAQ() {
  return (
    <div id="faq" className="w-full max-w-screen-xl mx-auto py-8 xs:py-16 px-6">
      <h2 className="md:text-center text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
        Pertanyaan yang Sering Ditanyain Tim 🤔
      </h2>
      <p className="mt-1.5 md:text-center xs:text-lg text-muted-foreground">
        Jawaban cepet untuk pertanyaan umum tentang booking ruang meeting
        kantor.
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
