import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading...", size = "default" }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-800 border-t-[#0077B6] animate-spin" />
        <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-[#0077B6] animate-pulse" />
      </div>
      {message && <p className="mt-4 text-sm font-medium text-slate-300 animate-pulse">{message}</p>}
    </div>
  );
}
