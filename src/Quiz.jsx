import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Utility: Fisher-Yates shuffle
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Style presets
const buttonStyle = {
  background: "rgba(0, 120, 255, 0.2)",
  border: "none",
  padding: "10px 1.5rem",
};

const Quiz = ({ category }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [attempted, setAttempted] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://music-quiz-backend.vercel.app/quiz?category=${category}`
        );
        const data = await res.json();
        if (data.success) {
          setQuestions(shuffleArray(data.questions));
          setCurrentQuestionIndex(0);
        } else {
          throw new Error("Failed to fetch questions");
        }
      } catch {
        setError("Could not load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setShowAnswer(true);
    setAttempted((prev) => prev + 1);

    if (index === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleEndQuiz = () => {
    setQuizComplete(true);
  };

  const current = questions[currentQuestionIndex];
  const isCorrect = selectedOption === current?.answer;

  // ───────────────────────────────────────────────
  if (loading)
    return (
      <h2 style={{ marginTop: "2rem", color: "#666", textAlign: "center" }}>
        Loading questions...
      </h2>
    );
  if (error)
    return (
      <h2 style={{ marginTop: "2rem", color: "#666", textAlign: "center" }}>
        {error}
      </h2>
    );
  if (!questions.length)
    return (
      <h2 style={{ marginTop: "2rem", color: "#666", textAlign: "center" }}>
        No questions found.
      </h2>
    );

  // ───────────────────────────────────────────────
  if (quizComplete) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>🎉 Quiz Completed!</h2>
        <p>
          You attempted <strong>{attempted}</strong> out of{" "}
          <strong>{questions.length}</strong> questions.
        </p>
        <p>
          You answered <strong>{score}</strong> correctly.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <button onClick={() => window.location.reload()} style={buttonStyle}>
            Restart Quiz
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            style={{ ...buttonStyle, marginLeft: "1rem" }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ margin: "1rem 0", color: "#666" }}>Q: {current.question}</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {current.options.map((opt, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => handleOptionClick(index)}
              disabled={showAnswer}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: showAnswer
                  ? index === current.answer
                    ? "green"
                    : index === selectedOption
                    ? "red"
                    : "lightgray"
                  : "white",
                color: showAnswer ? "white" : "#444",
                border: "1px solid #ccc",
                cursor: showAnswer ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      {showAnswer && (
        <div style={{ margin: "20px 0", fontStyle: "italic" }}>
          <p style={{ color: isCorrect ? "green" : "red" }}>
            {isCorrect ? "Correct!" : "Wrong!"}
          </p>
          {current.note && (
            <div style={{ border: "1px solid #444", padding: "0.5rem" }}>
              <strong>Note:</strong> {current.note}
            </div>
          )}
        </div>
      )}

      {showAnswer && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{ display: "flex", gap: "2rem", flexDirection: "column" }}
          >
            {attempted > 0 && (
              <button onClick={handleEndQuiz} style={buttonStyle}>
                End Quiz
              </button>
            )}
            <button
              onClick={() => navigate("/", { replace: true })}
              style={buttonStyle}
            >
              Go Home
            </button>
          </div>
          <div>
            <button onClick={handleNext} style={buttonStyle}>
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish"}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() =>
          navigate("/update", { state: { questionData: current } })
        }
        style={{ ...buttonStyle, marginTop: "5rem" }}
      >
        Edit Question
      </button>
    </div>
  );
};

export default Quiz;
