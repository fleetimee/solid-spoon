import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="bg-white dark:bg-gray-800 p-8  text-center max-w-md w-full">
        <AlertTriangle className="mx-auto mb-4 text-red-500 w-16 h-16 animate-pulse" />
        <h1 className="text-3xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
