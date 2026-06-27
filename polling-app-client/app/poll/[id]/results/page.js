"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPoll } from "@/lib/api";
import socket from "@/lib/socket";

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      const data = await getPoll(id);
      setPoll(data);
    };
    fetchPoll();

    socket.emit("join-poll", id);
    socket.on("poll-updated", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("poll-updated");
    };
  }, [id]);

  const totalVotes = poll?.options.reduce((sum, o) => sum + o.votes, 0);

  if (!poll) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading results...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          📊 {poll.question}
        </h1>
        <p className="text-sm text-gray-400 mb-6">{totalVotes} total votes</p>

        <div className="space-y-4">
          {poll.options
            .slice()
            .sort((a, b) => b.votes - a.votes)
            .map((option, index) => {
              const percentage = totalVotes
                ? Math.round((option.votes / totalVotes) * 100)
                : 0;
              const isWinning = option.votes === Math.max(...poll.options.map(o => o.votes));

              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${isWinning && totalVotes > 0 ? "text-blue-600" : "text-gray-700"}`}>
                      {isWinning && totalVotes > 0 ? "🏆 " : ""}{option.text}
                    </span>
                    <span className="text-gray-500">{option.votes} votes · {percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${isWinning && totalVotes > 0 ? "bg-blue-500" : "bg-gray-300"}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <button
          onClick={() => router.push(`/poll/${id}`)}
          className="mt-6 w-full border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-3 rounded-lg transition"
        >
          Back to poll
        </button>
      </div>
    </main>
  );
}