import React, { useState, useEffect } from 'react';

const Quiz = ({ category }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`https://music-quiz-backend.vercel.app/quiz?category=${category}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setQuestions(data.questions);
                    setCurrentQuestionIndex(Math.floor(Math.random() * data.questions.length));
                } else {
                    throw new Error("Failed to fetch questions");
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Could not load quiz questions.");
                setLoading(false);
            });
    }, [category]);

    if (loading) return <p>Loading questions...</p>;
    if (error) return <p>{error}</p>;
    if (!questions.length || currentQuestionIndex === null) return <p>No questions found.</p>;

    const questionData = questions[currentQuestionIndex];
    const isCorrect = selectedOption === questionData.answer;

    const handleOptionClick = (index) => {
        setSelectedOption(index);
        setShowAnswer(true);
    };

    const handleNext = () => {
        const nextIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
        setShowAnswer(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ margin: "1rem 0", color: "#666" }}>Q: {questionData.question}</h2>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {questionData.options.map((opt, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                        <button
                            onClick={() => handleOptionClick(index)}
                            disabled={showAnswer}
                            style={{
                                width: "100%",
                                padding: "10px",
                                backgroundColor: showAnswer
                                    ? index === questionData.answer
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
                <div style={{ margin: "20px 0", fontStyle: "italic" }}>
                    {isCorrect ? (
                        <p style={{ color: "green" }}>Correct!</p>
                    ) : (
                        <p style={{ color: "red" }}>Wrong!</p>
                    )}
                    {questionData.note && (
                        <div style={{ border: "1px solid #444", padding: "0.5rem" }}>
                            <strong>Note:</strong> {questionData.note}
                        </div>
                    )}
                </div>
            )}

            {showAnswer && (
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <button
                        style={{ background: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1.5rem" }}
                        onClick={() => setShowAnswer(false)}
                    >
                        Retry
                    </button>
                    <button
                        style={{ background: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1.5rem" }}
                        onClick={handleNext}
                    >
                        Next Question
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
