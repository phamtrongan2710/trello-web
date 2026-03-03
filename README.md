# 🧩 Trello Clone — Frontend (trello-web)

This project is the frontend application of a full-stack clone of **Trello**.
It provides a drag-and-drop task management interface similar to the original platform.

The application communicates with a separate backend API (`trello-api`) and focuses on UI/UX, state management, and real-time interaction.

---

## ✨ Features

* 🗂 Create / update / delete boards
* 📋 Create / update / delete lists (columns)
* 📝 Create / update / delete cards
* 🔄 Drag and drop:

  * Move columns
  * Move cards within a column
  * Move cards between columns
* 💾 Persist data via backend API
* 🔁 Optimistic UI updates
* 📱 Responsive layout

---

## 🧠 Tech Stack

* React
* Vite
* Material UI (MUI)
* DndKit (Drag & Drop)
* Axios
* REST API integration

---

## 📂 Project Structure

```
src/
├── components/
├── pages/
├── services/
├── utils/
├── hooks/
├── redux/ (if used)
└── main.jsx
```

---

## 🔄 Application Architecture

Frontend responsibilities:

1. Handle UI rendering
2. Manage client-side state
3. Send HTTP requests to backend
4. Handle drag-and-drop logic
5. Sync state with server

Flow:

```
User Action → UI Event → API Request → Backend Response → State Update → Re-render
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/phamtrongan2710/trello-web.git
cd trello-web
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run development server

```bash
npm run dev
```

---

## 🚀 Future Improvements

* [ ] Role-based access control
* [ ] Real-time updates (WebSocket)
* [ ] Performance optimization for large boards
* [ ] Unit & integration tests

---

## 📜 License

MIT
