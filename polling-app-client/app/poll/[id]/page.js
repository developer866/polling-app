"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPoll, submitVote, closePoll } from "@/lib/api";
import socket from "@/lib/socket";

export default function PollPage() {
  const router = useRouter();
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [closePassword, setClosePassword] = useState("");
  const [closeError, setCloseError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchPoll = async () => {
      const data = await getPoll(id);
      if (data._id) {
        setPoll(data); // only set if it's a valid poll
      } else {
        console.error("Poll not found:", data.message);
      }
    };
    fetchPoll();

    const hasVoted = localStorage.getItem(`voted-${id}`);
    if (hasVoted) {
      setVoted(true);
      setSelectedOption(parseInt(hasVoted));
    }

    socket.emit("join-poll", id);

    socket.on("poll-updated", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    socket.on("poll-closed", (closedPoll) => {
      setPoll(closedPoll);
    });

    return () => {
      socket.off("poll-updated");
      socket.off("poll-closed");
    };
  }, [id]);

  const handleVote = async (index) => {
    if (voted || poll?.status === "closed") return;
    setSelectedOption(index);
    setVoted(true);
    localStorage.setItem(`voted-${id}`, index);
    await submitVote(id, index);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = async () => {
    setClosing(true);
    setCloseError("");
    const result = await closePoll(id, closePassword);
    if (result.message === "Incorrect password") {
      setCloseError("Incorrect password. Try again.");
      setClosing(false);
      return;
    }
    setShowModal(false);
    setClosing(false);
  };
  const totalVotes = poll?.options.reduce((sum, o) => sum + o.votes, 0);
  const isClosed = poll?.status === "closed";

  if (!poll)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading poll...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">
        {/* Poll status badge */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{poll.question}</h1>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              isClosed
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isClosed ? "🔴 Closed" : "🟢 Active"}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">{totalVotes} votes</p>
        {/* Closed banner */}
        {!isClosed && (
          <button
            onClick={() => setShowModal(true)} // ← open modal, not handleClose
            disabled={closing}
            className="w-full mt-5 border border-red-400 text-red-400 hover:bg-red-50 font-medium py-3 rounded-lg transition disabled:opacity-50"
          >
            {closing ? "Closing..." : "End Voting"}
          </button>
        )}{" "}
        {isClosed && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-sm text-red-500">
            Voting has ended for this poll.
          </div>
        )}
        <div className="space-y-3">
          {poll.options.map((option, index) => {
            const percentage = totalVotes
              ? Math.round((option.votes / totalVotes) * 100)
              : 0;

            return (
              <div
                key={index}
                onClick={() => handleVote(index)}
                className={`relative border rounded-xl px-4 py-3 overflow-hidden transition
                  ${!voted && !isClosed ? "cursor-pointer hover:border-blue-400" : "cursor-default"}
                  ${selectedOption === index ? "border-blue-500" : "border-gray-200"}
                `}
              >
                {voted && (
                  <div
                    className="absolute inset-0 bg-blue-50 transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                <div className="relative flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {option.text}
                  </span>
                  {voted && (
                    <span className="text-sm font-bold text-blue-600">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
     
        {/* View results button */}
        {voted && (
          <button
            onClick={() => router.push(`/poll/${id}/results`)}
            className="w-full mt-3 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-lg transition"
          >
            View Results
          </button>
        )}
        {/* Share link */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Share this poll</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500"
            />
            <button
              onClick={handleCopy}
              className={`text-xs px-4 py-2 rounded-lg transition font-medium ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for password */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">End Voting</h2>
            <p className="text-sm text-gray-400 mb-4">
              Enter your poll password to close voting permanently.
            </p>
            <input
              type="password"
              value={closePassword}
              onChange={(e) => setClosePassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
            />
            {closeError && (
              <p className="text-xs text-red-500 mb-3">{closeError}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCloseError("");
                  setClosePassword("");
                }}
                className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                disabled={closing}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {closing ? "Closing..." : "End Voting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
