"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublicPolls } from "@/lib/api";

export default function ExplorePage() {
  const router = useRouter();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searchError, setSearchError] = useState(""); 

  useEffect(() => {
    const fetchPolls = async () => {
      const data = await getPublicPolls();
      setPolls(data);
      setLoading(false);
    };
    fetchPolls();
  }, []);

 const  handleSearch = () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a poll ID");
      return;
    }
    router.push(`/poll/${searchId}`);
  }
  
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading polls...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setSearchError("");
          }}
          placeholder="Enter poll ID to find a specific poll..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
        >
          Search
        </button>
      </div>
      {searchError && (
        <p className="text-xs text-red-500 mb-4">{searchError}</p>
      )}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          🌍 Explore Polls
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Browse and vote on public polls
        </p>

        {polls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-4xl mb-3">🗳️</p>
            <p className="text-gray-500 font-medium">No public polls yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Be the first to create one
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create a Poll
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce(
                (sum, o) => sum + o.votes,
                0,
              );
              const isClosed = poll.status === "closed";

              return (
                <div
                  key={poll._id}
                  onClick={() => router.push(`/poll/${poll._id}`)}
                  className="bg-white rounded-2xl shadow px-6 py-5 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-base font-semibold text-gray-800">
                      {poll.question}
                    </h2>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${
                        isClosed
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isClosed ? "🔴 Closed" : "🟢 Active"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {poll.options.map((option, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                      >
                        {option.text}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      🗳️ {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                    </span>
                    <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
