const BASE_URL = Process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const createPoll = async (question, options,isPublic,password) => {
  const res = await fetch(`${BASE_URL}api/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, options, isPublic, password }),
  });
  return res.json();
};

export const getPoll = async (id) => {
  const res = await fetch(`${BASE_URL}api/polls/${id}`);
  return res.json();
};

export const submitVote = async (id, optionIndex) => {
  const res = await fetch(`${BASE_URL}api/polls/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ optionIndex }),
  });
  return res.json();
};

export const closePoll = async (id, password) => {
  const res = await fetch(`${BASE_URL}api/polls/${id}/close`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
};

export const getPublicPolls = async () => {
  const res = await fetch(`${BASE_URL}api/polls/public`);
  return res.json();
};