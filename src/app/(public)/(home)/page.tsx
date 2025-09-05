import Link from "next/link";

export default function Page() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Home</h1>
        <Link href="/auth">Get started</Link>
      </div>
    </div>
  );
}
