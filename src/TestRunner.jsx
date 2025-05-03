import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const buttonStyle = {
    background: "rgba(0, 120, 255, 0.2)",
    border: "none",
    padding: "10px 1.5rem",
    cursor: "pointer"
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const TestRunner = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { questions, category, testIndex } = state || {};

    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (questions?.length) {
            setShuffledQuestions(shuffleArray(questions));
        }
    }, [questions]);

    if (!shuffledQuestions.length) {
        return <h2 style={{ color: 'crimson' }}>No questions available!</h2>;
    }

    const current = shuffledQuestions[currentIndex];
    const isCorrect = selectedOption === current.answer;

    const handleOptionClick = (index) => {
        setSelectedOption(index);
        setShowAnswer(true);
        if (index === current.answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < shuffledQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            setFinished(true);
        }
    };

    const handleBackToMenu = () => {
        navigate('/test');
    };

    return (
        <div style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
            {finished ? (
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: "#666" }}>🎉 Test Completed!</h2>
                    <p style={{ color: "#444", marginTop: "1rem", marginBottom: "2rem" }}>You scored <strong>{score}</strong>/<strong>{shuffledQuestions.length}</strong>.</p>
                    <button onClick={handleBackToMenu} style={buttonStyle}>Back to Tests</button>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <h2 style={{ color: "#666" }}>Q{currentIndex + 1}:</h2>
                        <h2 style={{ color: "#666" }}>{current.question}</h2>
                    </div>
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
                                        cursor: showAnswer ? "default" : "pointer"
                                    }}
                                >
                                    {opt}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {showAnswer && (
                        <div style={{ marginTop: "1rem" }}>
                            <p style={{ color: isCorrect ? "green" : "red" }}>
                                {isCorrect ? "Correct!" : "Wrong!"}
                            </p>
                            {current.note && (
                                <div style={{ marginTop: "0.5rem", border: "1px solid #ccc", padding: "0.5rem" }}>
                                    <strong>Note:</strong> {current.note}
                                </div>
                            )}
                            <div style={{ textAlign: 'right', marginTop: "1rem" }}>
                                <button onClick={handleNext} style={buttonStyle}>
                                    {currentIndex < shuffledQuestions.length - 1 ? "Next" : "Finish"}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TestRunner;
