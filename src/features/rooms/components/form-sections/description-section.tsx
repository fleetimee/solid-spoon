import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FileText, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../schemas/room-form-schema";

interface DescriptionSectionProps {
  form: UseFormReturn<FormValues>;
}

export function DescriptionSection({ form }: DescriptionSectionProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              📋 Description & Details
            </CardTitle>
            <CardDescription className="text-base">
              Help users understand what makes this room special
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Room Description
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Provide details about the room&apos;s features, atmosphere, and
                ideal uses
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Describe the room's atmosphere, unique features, and what makes it perfect for certain types of meetings or events..."
                  rows={5}
                  {...field}
                  className="text-base border-2 focus:border-emerald-500/50 transition-colors resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
