"use client";

import { ProgressProvider } from "@bprogress/next/app";

const BProgressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="4px"
      color="oklch(0.61 0.22 292.72)" // Primary purple color from theme
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default BProgressProviders;
