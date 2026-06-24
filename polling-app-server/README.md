# 🗳️ Polling App Server

A real-time live polling application built with Node.js, Express, Socket.io, and MongoDB.

## Features

- Create polls with a question and multiple options
- Vote on any poll — no account needed
- Results update live in real time for everyone watching
- Share any poll via link
- Each poll has its own room — only relevant users get updates

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express
- **Real-time** — Socket.io
- **Database** — MongoDB + Mongoose
- **Frontend** — Next.js (separate repo)

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account or local MongoDB instance

### Installation

```bash
git clone https://github.com/developer866/polling-app-server.git
cd polling-app-server
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
```

### Run the server

```bash
node server.js
```

Server runs on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/polls` | Create a new poll |
| GET | `/api/polls/:id` | Get a single poll |
| POST | `/api/polls/:id/vote` | Submit a vote |
| GET | `/api/polls` | List all polls |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-poll` | Client → Server | Join a poll room |
| `vote-update` | Server → Client | Broadcast updated vote counts |

## Project Structure

```
polling-app-server/
├── models/
│   └── Poll.js       # MongoDB schema
├── routes/
│   └── poll.js       # API routes
├── server.js         # Entry point
└── .env              # Environment variables (not committed)
```

## Author

**Ayeni Opeyemi Joseph**
- Portfolio: [ayeni-opeyemi.vercel.app](https://ayeni-opeyemi.vercel.app)
- GitHub: [@developer866](https://github.com/developer866)

## License

MIT
