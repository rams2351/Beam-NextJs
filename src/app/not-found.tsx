import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" min-h-screen flex flex-col space-y-4 items-center justify-center w-full">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
