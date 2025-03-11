"use client";

import { Suspense } from "react";

// components
import ProgressBar from "@/components/ProgressBar";

// 3rd party libraries
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache stays in memory for 10 minutes
      // refetchOnWindowFocus: false, // Don't refetch when window refocuses
      // refetchOnMount: false, // Don't refetc
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <ProgressBar />
        </Suspense>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
