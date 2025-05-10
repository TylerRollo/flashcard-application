import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Decks from './pages/Decks';
import DeckDetails from './pages/DeckDetails';
import Playgame from "./pages/Playgame";
import PlaygameDetails from './pages/PlaygameDetails';
import Results from "./pages/Results";
import UploadCSV from "./pages/FastAdd";
import Confirmation from './pages/Confirmation';

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
        <Route path="/decks/:id" element={<DeckDetails />} />
        <Route path="/playgame" element={<Playgame />} />
        <Route path="/playgame/confirmation/:id" element={<Confirmation />} />
        <Route path="/playgame/:id" element={<PlaygameDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/fastadd" element={<UploadCSV />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </Router>
  );
}

export default App;
