import React from "react";

const Spinner = ({ size = "md", message = "" }) => {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${sizes[size]} rounded-full border-neo-mint border-t-neo-blue animate-spin`}
        style={{ borderWidth: size === "lg" ? 4 : size === "sm" ? 2 : 3 }}
      />
      {message && (
        <p className="text-sm text-neo-muted font-body animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Spinner;
