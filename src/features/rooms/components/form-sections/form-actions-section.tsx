import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Room } from "../../types/room";

interface FormActionsSectionProps {
  isPending: boolean;
  isUploading: boolean;
  isUpdateMode: boolean;
  room?: Room;
  onCancel: () => void;
}

export function FormActionsSection({
  isPending,
  isUploading,
  isUpdateMode,
  room,
  onCancel,
}: FormActionsSectionProps) {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
      <CardContent className="pt-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              All fields marked with{" "}
              <span className="text-destructive font-medium">*</span> are
              required
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="min-w-[120px] h-12"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="min-w-[160px] h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUpdateMode ? "Updating..." : "Creating..."}
                </>
              ) : isUpdateMode ? (
                "Update Room"
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
