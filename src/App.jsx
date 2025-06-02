import { Routes, Route } from "react-router-dom";
import "./App.css";
import Quiz from "./Quiz.jsx";
import TestSelector from "./TestSelector.jsx";
import TestRunner from "./TestRunner.jsx";
import Login from "./Login.jsx";
import Login2 from "./Login2.jsx";
import Home from "./Home.jsx";

function App() {
  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/music" element={<Quiz category="music,tabla" />} />
        <Route path="/quiz/dance" element={<Quiz category="dance,tabla" />} />
        <Route path="/test" element={<TestSelector />} />
        <Route path="/test/start/:index" element={<TestRunner />} />
        <Route path="/add" element={<Login />} />
        <Route path="/update" element={<Login2 />} />
      </Routes>
    </div>
  );
}

export default App;
