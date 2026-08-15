import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Fetching cases from database...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-3 text-emerald-800">
      <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
      <p className="text-sm font-semibold tracking-wide animate-pulse m-0">
        {message}
      </p>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 py-4 px-2">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-16 bg-gray-200/80 rounded flex-1"></div>
            <div className="h-16 bg-gray-200/80 rounded flex-1"></div>
            <div className="h-16 bg-gray-200/80 rounded w-28"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
