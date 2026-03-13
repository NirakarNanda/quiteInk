# QuietInk ✒️

A quiet little corner of the internet where thoughts meet a typewriter and an AI listens back.

QuietInk is a **digital journaling experience** designed to feel calm, reflective, and slightly magical.
Write your thoughts on a virtual typewriter while a sheet of paper slowly rolls out — just like the real thing.

Built purely for the **vibe**.

---

## ✨ Features

• Vintage **typewriter-style journaling interface**
• Smooth **paper animation while writing**
• AI responses that gently reflect on your thoughts
• Save journal entries
• Edit existing entries
• Delete entries
• View all past journals

---

## 🧠 Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## 📁 Project Structure

```
quietink
│
├── client          # Next.js frontend
│
├── server          # Node.js + Express backend
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/yourusername/quietink.git
cd quietink
```

---

### 2. Install dependencies

#### Client

```
cd client
npm install
```

#### Server

```
cd server
npm install
```

---

### 3. Environment Variables

Create a `.env` file inside the **server** folder.

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
```

---

### 4. Run the backend

```
cd server
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

### 5. Run the frontend

```
cd client
npm run dev
```

Frontend will start at:

```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/journals`     | Create journal entry |
| GET    | `/api/journals`     | Get all journals     |
| PUT    | `/api/journals/:id` | Update journal       |
| DELETE | `/api/journals/:id` | Delete journal       |

---

## 🌙 Philosophy

QuietInk isn't meant to be loud or complex.

It's just a **small digital space** to pause, write, and reflect.

Sometimes the best ideas arrive in silence.

---

## 🛠 Future Improvements

• User authentication
• Private journals
• Mood detection from writing
• Search & filter entries
• AI conversation mode
• Dark writing mode

---

## 💭 Final Note

This project was **vibe coded for fun**.

A tiny experiment mixing **design, reflection, and AI**.

If it makes someone pause for a moment and write their thoughts — it's already successful.
