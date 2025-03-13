import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Decks from './pages/Decks';
import DeckDetails from './pages/DeckDetails';  // Import DeckDetails
import Playgame from "./pages/Playgame"
import PlaygameDetails from './pages/PlaygameDetails';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/decks/:id" element={<DeckDetails />} /> {/* Add this route for deck details */}
        <Route path="/playgame" element={<Playgame />} />
        <Route path="/playgame/:id" element={<PlaygameDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
