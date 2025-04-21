"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteRoomAction } from "../api/deleteRoom";
import { Room } from "../types/room";

interface DeleteRoomFormProps {
  room: Room;
}

export function DeleteRoomForm({ room }: DeleteRoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmName, setConfirmName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationValid, setIsConfirmationValid] = useState(false);

  useEffect(() => {
    setIsConfirmationValid(confirmName === room.name);
  }, [confirmName, room.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (confirmName !== room.name) {
      setError("Room name confirmation doesn't match");
      return;
    }

    const formData = new FormData();
    formData.append("roomName", room.name);
    formData.append("confirmName", confirmName);

    startTransition(async () => {
      const result = await deleteRoomAction(room.id, formData);

      if (result.success) {
        toast.success("Room deleted successfully", {
          description: `${room.name} has been removed from the system.`,
        });
        router.push("/admin/rooms");
        router.refresh();
      } else {
        setError(result.error || result.message);
        toast.error("Failed to delete room", {
          description: result.message,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2">
          <label
            htmlFor="confirmName"
            className="text-sm font-medium text-destructive"
          >
            Confirmation
          </label>
          <Input
            id="confirmName"
            name="confirmName"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder="Type the room name here"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            className={`mt-1 ${
              confirmName && !isConfirmationValid
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            disabled={isPending}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 items-center mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            type="submit"
            className="gap-2"
            disabled={!isConfirmationValid || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Room
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          {!isConfirmationValid && confirmName.length > 0
            ? "The text you've entered doesn't match the room name."
            : "You must type the exact room name to confirm deletion."}
        </p>
      </div>
    </form>
  );
}
