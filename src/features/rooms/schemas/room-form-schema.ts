import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nama ruangan diperlukan"),
  location: z.string().min(1, "Lokasi diperlukan"),
  capacity: z.coerce
    .number()
    .min(1, "Kapasitas minimal 1 orang")
    .max(1000, "Kapasitas tidak boleh melebihi 1000 orang"),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
