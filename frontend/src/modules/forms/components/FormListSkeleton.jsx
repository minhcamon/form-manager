import React from "react";

export const FormListSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-48 rounded-2xl border border-border bg-card p-6 animate-pulse space-y-4"
        >
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

export default FormListSkeleton;
