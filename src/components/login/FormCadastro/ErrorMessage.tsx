"use client";

import React from "react";

interface ErrorMessageProps {
  readonly message: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="text-center border border-[#B40C31] text-[#B40C31] text-[14px] font-bold rounded-[4px] py-2 px-3 my-6 max-w-sm w-full mx-auto break-words">
      {message}
    </div>
  );
}