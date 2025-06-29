# TaskWave
# ✅ TaskWave - Full Stack Task Management App

**TaskWave** is a powerful and modern task management web application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Firebase Authentication. It helps users stay productive with features like Google login, real-time task updates, and a clean, user-friendly UI.

---

## 📌 Features

- 🔐 Google OAuth Authentication (via Firebase)
- 🧠 Add, View, Edit, Delete Tasks
- ⚡ Real-time task syncing using WebSockets (Socket.IO)
- 🧩 Modular RESTful API using Express
- 📦 MongoDB Atlas for secure cloud database
- 🎨 Beautiful responsive UI with Tailwind CSS
- 🌍 Deployed using Vercel (frontend) and Render (backend)

---

## 🛠️ Tech Stack

| Layer     | Technologies                         |
|-----------|--------------------------------------|
| Frontend  | React (Vite), Tailwind CSS, Axios    |
| Backend   | Node.js, Express.js, Socket.IO       |
| Database  | MongoDB Atlas                        |
| Auth      | Firebase Authentication              |
| Hosting   | Vercel (client), Render (API server) |
![readme](https://github.com/user-attachments/assets/8e71f9aa-7808-4f68-aa9d-014cb16ed9ea)

---

## 📁 Project Structure
TaskWave_project/
├── client/                         # Frontend (React + Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # Reusable React components (TaskCard, AddTaskModal, etc.)
│   │   ├── pages/                  # Page-level components (Dashboard, Login, etc.)
│   │   ├── services/               # Axios config and API functions
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                         # Backend (Node.js + Express + Socket.IO)
│   ├── config/                     # Firebase Admin SDK and env setup
│   │   └── firebase.js
│   ├── controllers/               # Business logic for task and auth APIs
│   ├── middleware/                # Middleware for auth token checks
│   ├── models/                    # Mongoose schemas (Task.js, User.js)
│   ├── routes/                    # Express route handlers (taskRoutes.js, authRoutes.js)
│   ├── socket/                    # Socket.IO logic (client connection, task broadcasts)
│   ├── utils/                     # Helper functions if any
│   ├── index.js                   # Main Express server entry
│   ├── package.json
│   └── .env                       # Environment variables (excluded via .gitignore)
│
├── .gitignore
├── README.md
└── LICENSE

---

## 🚀 Getting Started

### 1. Clone the Repo

git clone https://github.com/EzhilAadhithyan-K/TaskWave_project.git
cd TaskWave_project

### 2. Setup the Backend
cd server
npm install

Create a .env file in the server folder:

PORT=5000
MONGO_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_firebase_project_id


Start the server:
npm start

### 3. Setup the Frontend
cd client
npm install
npm run dev

The client runs on http://localhost:5173 and the server runs on http://localhost:5000.

### 📸 Screenshots
![Vite _ React](https://github.com/user-attachments/assets/657c0524-72aa-458c-b650-f1c3501e2c20)

### 🧑‍💻 Developer

## Ezhil Aadhithyan K
📌 [GitHub](https://github.com/EzhilAadhithyan-K)

📌 Open to collaboration and feedback!



### 📃 License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute it as per the terms.



