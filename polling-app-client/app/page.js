"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPoll } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return alert("Please enter a question");
    if (options.some((o) => !o.trim())) return alert("Please fill all options");
    if (!password.trim())
      return alert("please enter a password to protect your poll");

    setLoading(true);
    const poll = await createPoll(question, options, isPublic, password);
    router.push(`/poll/${poll._id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🗳️ Create a Poll
        </h1>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you want to ask?"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Options
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-400 hover:text-red-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="text-blue-500 text-sm mt-1 hover:underline"
            >
              + Add option
            </button>
          )}
        </div>

        {/* Public / Private toggle */}
        <div className="mb-6 flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isPublic ? "🌍 Public poll" : "🔒 Private poll"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPublic
                ? "Anyone can find and vote on this poll"
                : "Only people with the link can vote"}
            </p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 rounded-full transition-colors duration-300 ${
              isPublic ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 mx-0.5 ${
                isPublic ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Poll Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a password to end voting later"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            You will need this to end voting
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </main>
  );
}
