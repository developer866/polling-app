"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">
        🗳️ PollApp
      </Link>
      <div className="flex gap-4 text-sm">
        <Link
          href="/"
          className={`font-medium transition ${
            pathname === "/" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Create Poll
        </Link>
        <Link
          href="/explore"
          className={`font-medium transition ${
            pathname === "/explore" ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Explore
        </Link>
      </div>
    </nav>
  );
}