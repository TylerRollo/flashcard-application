# 📚 Flashcard Application

A full-stack flashcard application that allows users to create, manage, and play with flashcard decks. This project consists of a **React Frontend**, a **Node.js & Express API**, and a **MySQL Backend**.

---

## 🚀 Features

- **Create & Manage Decks** – Users can add, edit, and delete flashcard decks.
- **Play with Flashcards** – Users can test their knowledge by flipping through flashcards.
- **REST API** – Fetch, create, update, and delete decks/cards.
- **Modern UI** – Responsive and colorful frontend using React and Bootstrap.

---

## 🛠️ Technologies Used

### **Frontend:**
- **React** – Component-based UI
- **React Router** – Handles navigation
- **CSS** – Styling
- **Fetch API / Axios** – Handles API calls

### **Backend:**
- **Node.js** – JavaScript runtime
- **Express.js** – Handles API requests
- **MySQL** – Database

---

## ⚙️ Installation & Setup

### **1. Clone the repository**
```sh
git clone https://github.com/yourusername/flashcard-app.git
cd flashcard-app
```

### **2. Install dependencies**
#### **Backend**
```sh
cd backend
npm install
```

#### **Frontend**
```sh
cd frontend
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the backend directory:
```
MYSQL_HOST='your_host'
MYSQL_USER='your_user'
MYSQL_PASSWORD='your_password'
MYSQL_DATABASE='your_db'
PORT=your_port_number 
```

### **4. Start the backend**
```sh
cd backend
npm start
```

### **5. Start the frontend**
```sh
cd frontend
npm start
```

---

## 📡 API Endpoints

### **Decks**
- `GET /api/decks` – Fetch all deck
- `GET /api/decks/:id` - Fetch a single deck by id
- `POST /api/decks` – Create a new deck
- `DELETE /api/decks/:id` – Delete a deck
- `PUT /api/decks/:id` - Update deck name/description

### **Cards**
- `GET /api/flashcards/:deckId` – Get cards from a deck
- `POST /api/flashcards/:deckId` – Add a card to a deck
- `DELETE /api/flashcards/:deckId` – Delete a card

---

## 🎮 Usage Guide

1. **Select a deck** on the homepage.
2. **Add new flashcards** to your deck.
3. **Play the game** by flipping through flashcards.
4. **Delete decks/cards** when needed.

---

## 📌 Future Enhancements
- Progress Tracking
- Categorizing cards within a deck
- User authentication (login system)
- Selective Flashcard shuffling mode
- Cloud based application

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).

---

## 👨‍💻 Author 
[GitHub](https://github.com/TylerRollo) | [LinkedIn](https://linkedin.com/in/tyler-rollo)


## TODO:
- add delete all selected decks or cards feature (decks and cards)
- make a .csv file of a deck 
- ability to choose which cards out of a deck to use
- change all alerts to something cleaner
- format names of Decks to wrap around when name is too long

### Security Checks (TODO:)
- file types uploads
- name length bounds
- 