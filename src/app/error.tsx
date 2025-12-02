"use client"; // Error boundaries must be Client Components

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">{error?.message}</h1>
        <h2>Something went wrong!</h2>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </div>
  );
}
