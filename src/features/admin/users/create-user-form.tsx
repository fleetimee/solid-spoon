"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Crown,
  UserPlus,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define valid role options
const ROLES = ["user", "admin"] as const;

const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(8, "Kata sandi harus minimal 8 karakter"),
  role: z.enum(ROLES, {
    required_error: "Silakan pilih peran",
  }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onUserCreated: () => void;
}

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await authClient.admin.createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (result.error) {
        console.error("Error creating user:", result.error);
        toast.error(`Gagal membuat pengguna: ${result.error.message}`);
      } else {
        toast.success(`Pengguna "${values.name}" berhasil dibuat!`);
        form.reset();
        onUserCreated();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Caught error creating user:", error);
      toast.error("Terjadi kesalahan tak terduga saat membuat pengguna.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Plus className="mr-2 h-4 w-4" /> Buat Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] border-0 bg-gradient-to-br from-white/95 to-violet-50/90 dark:from-gray-950/95 dark:to-violet-950/50 backdrop-blur-xl shadow-2xl">
        {/* Modern Dialog Header with Gradient Icon */}
        <DialogHeader className="space-y-6 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Buat Pengguna Baru
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Masukkan detail untuk pengguna baru. Klik simpan setelah
                selesai.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {/* Glassmorphism Form Container */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/30 to-purple-50/30 dark:from-violet-950/5 dark:to-purple-950/5 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400/3 to-purple-400/3" />
          <div className="relative p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        Nama
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="mis., John Doe"
                          {...field}
                          disabled={isSubmitting}
                          className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <Mail className="h-3 w-3 text-white" />
                        </div>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="mis., john.doe@example.com"
                          {...field}
                          disabled={isSubmitting}
                          className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <Lock className="h-3 w-3 text-white" />
                        </div>
                        Kata Sandi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Harus minimal 8 karakter"
                          {...field}
                          disabled={isSubmitting}
                          className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mr-2">
                          <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                        Peran
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="border-violet-200/50 dark:border-violet-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm focus:border-violet-400 focus:ring-violet-400/20 transition-all duration-200">
                            <SelectValue placeholder="Pilih peran" />
                          </SelectTrigger>
                          <SelectContent className="border-violet-200/50 dark:border-violet-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                            <SelectGroup>
                              <SelectLabel className="text-violet-600 dark:text-violet-400 font-medium">
                                Peran yang Tersedia
                              </SelectLabel>
                              {ROLES.map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="focus:bg-violet-50 dark:focus:bg-violet-950/50"
                                >
                                  <div className="flex items-center gap-2">
                                    {role === "admin" ? (
                                      <Crown className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                    ) : (
                                      <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                    )}
                                    {role.charAt(0).toUpperCase() +
                                      role.slice(1)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-xs text-muted-foreground">
                        Izin pengguna ditentukan oleh peran mereka.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Modern Action Buttons */}
        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="border-violet-200/50 dark:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-all duration-200"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Buat Pengguna
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
