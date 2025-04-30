import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Quiz from './Quiz.jsx';
import AddQuestion from './AddQuestion.jsx';

function App() {
  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <Router>
        <Routes>

          {/* 🏠 Home Page */}
          <Route path="/" element={
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div>
                <h1 style={{ margin: "1rem 0", color: "#666" }}>Welcome to quiz website!!</h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <Link to="/quiz/dance">
                    <button style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                      Dance Quiz
                    </button>
                  </Link>
                  <Link to="/quiz/music">
                    <button style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                      Music Quiz
                    </button>
                  </Link>

                <Link to="/add">
                  <button style={{ backgroundColor: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1rem" }}>
                    Add Question
                  </button>
                </Link>
              </div>
            </div>
          } />

          {/* 🎵 Music Quiz */}
          <Route path="/quiz/music" element={<Quiz category="music" />} />

          {/* 💃 Dance Quiz */}
          <Route path="/quiz/dance" element={<Quiz category="dance" />} />

          {/* ➕ Add Question */}
          <Route path="/add" element={<AddQuestion />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
