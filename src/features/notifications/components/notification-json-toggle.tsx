import { NotificationFilter } from "../types/notification";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Code } from "lucide-react";

interface NotificationJsonToggleProps {
  showJson: boolean;
  filter?: string;
  page?: string;
  pageSize?: string;
}

export function NotificationJsonToggle({
  showJson,
  filter,
  page,
  pageSize,
}: NotificationJsonToggleProps) {
  const getToggleJsonUrl = (show: boolean) => {
    const params = new URLSearchParams();

    if (filter) {
      params.set("filter", filter);
    }

    if (page) {
      params.set("page", page);
    }

    if (pageSize) {
      params.set("pageSize", pageSize);
    }

    params.set("showJson", show.toString());

    return `/admin/notifications?${params.toString()}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="show-json" className="text-sm">
        Tampilkan JSON
      </Label>
      <Link href={getToggleJsonUrl(!showJson)} className="inline-flex">
        <Switch id="show-json" checked={showJson} />
      </Link>
    </div>
  );
}

export function NotificationJsonView({ data }: { data: unknown }) {
  return (
    <div className="rounded-lg border bg-card p-4 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Code className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Data Notifikasi Mentah (JSON)</h2>
      </div>
      <pre className="bg-muted p-4 rounded overflow-auto max-h-[400px] text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
