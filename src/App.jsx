import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Quiz from './Quiz.jsx';
import TestSelector from './TestSelector.jsx';
import AddQuestion from './AddQuestion.jsx';
import TestRunner from './TestRunner.jsx';
import Login from './Login.jsx';
import Login2 from './Login2.jsx';
import UpdateQuestion from './UpdateQuestion.jsx';

function App() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <Routes>

        {/* 🏠 Home Page */}
        <Route path="/" element={
          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h1 style={{ margin: "1rem 0", color: "#666" }}>Welcome to quiz website!!</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <button onClick={() => navigate("/quiz/dance")} style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                Dance Quiz
              </button>
              <button onClick={() => navigate("/quiz/music")} style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                Music Quiz
              </button>
              <button onClick={() => navigate("/test")} style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>Test Series</button>
              <button onClick={() => navigate("/add")} style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                Add Question
              </button>
            </div>
          </div>
        } />

        {/* 🎵 Music Quiz */}
        <Route path="/quiz/music" element={<Quiz category="music,tabla" />} />

        {/* 💃 Dance Quiz */}
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
