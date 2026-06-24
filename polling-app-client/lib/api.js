const BASE_URL = "http://localhost:5000/api";

export const createPoll = async (question, options) => {
  const res = await fetch(`${BASE_URL}/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, options }),
  });
  return res.json();
};

export const getPoll = async (id) => {
  const res = await fetch(`${BASE_URL}/polls/${id}`);
  return res.json();
};

export const submitVote = async (id, optionIndex) => {
  const res = await fetch(`${BASE_URL}/polls/${id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ optionIndex }),
  });
  return res.json();
};