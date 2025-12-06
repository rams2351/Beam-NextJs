"use client"; // Error boundaries must be Client Components

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center   w-full h-screen">
      <div className="flex flex-col items-center justify-center h-screen max-w-4xl">
        <h1 className="text-xl text-wrap whitespace-break-spaces text-red-600 font-bold">{error?.message}</h1>
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
