import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home"
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Decks from './pages/Decks';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/decks" element={<Decks/>} />
      </Routes>
    </Router>
  );
}

export default App;
