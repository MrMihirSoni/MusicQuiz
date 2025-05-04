import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from './TestContext';
import axios from 'axios';

const buttonStyle = {
    background: "rgba(0, 120, 255, 0.2)",
    border: "none",
    padding: "10px 1.5rem",
    cursor: "pointer"
};

const TestSelector = () => {
    const { category, setCategory, limit, setLimit, categorySelected, setCategorySelected } = useTestContext();
    const [questionSets, setQuestionSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePlus = () => {
        if (limit < 50) setLimit(prev => prev + 5);
    };

    const handleMinus = () => {
        if (limit > 5) setLimit(prev => prev - 5);
    };

    const splitIntoChunks = (questions, size) => {
        const chunks = [];
        for (let i = 0; i < questions.length; i += size) {
            chunks.push(questions.slice(i, i + size));
        }
        return chunks;
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://music-quiz-backend.vercel.app/quiz?category=${category}`);
            const questions = res.data.questions || [];
            const sets = splitIntoChunks(questions, limit);
            setQuestionSets(sets);
            setError(null);
        } catch (err) {
            setError("Failed to fetch questions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!category) return;

        // Clear previous question sets before fetching new ones
        setQuestionSets([]);

        fetchQuestions();
    }, [category, limit]);

    const handleStartTest = (index) => {
        navigate(`/test/start/${index}`, {
            state: { questions: questionSets[index], category, testIndex: index + 1 },
            replace: true
        });
    };

    return (
        <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }} key={`${category}-${limit}`}>
            <h2 style={{ color: "#666" }}>Select Number of Questions Per Test</h2>

            {/* Category selection */}
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
                <label style={{ background: category === "dance,tabla" && "rgba(0, 120, 255, 0.2)", padding: "10px 1.5rem 10px 0" }}>
                    <input
                        type="radio"
                        value="dance,tabla"
                        checked={category === "dance,tabla"}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCategorySelected(true);
                        }}
                    /> Dance
                </label>
                <label style={{ background: category === "music,tabla" && "rgba(0, 120, 255, 0.2)", padding: "10px 1.5rem 10px 0" }}>
                    <input
                        type="radio"
                        value="music,tabla"
                        checked={category === "music,tabla"}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCategorySelected(true);
                        }}
                    /> Music
                </label>
            </div>

            {/* Limit selection */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button onClick={handleMinus} style={buttonStyle}>-</button>
                <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>{limit}</span>
                <button onClick={handlePlus} style={buttonStyle}>+</button>
            </div>

            {/* Test list */}
            {categorySelected && (
                <>
                    {loading ? (
                        <h2 style={{ color: "#666" }}>Loading questions...</h2>
                    ) : error ? (
                        <h2 style={{ color: 'crimson' }}>{error}</h2>
                    ) : (
                        <div>
                            <h3>Available Tests:</h3>
                            {questionSets.map((set, index) => (
                                <div key={index} style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc" }}>
                                    <p>Test {index + 1} &#40;{set.length} questions&#41;</p>
                                    <button onClick={() => handleStartTest(index)} style={buttonStyle}>
                                        Start Test
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <button onClick={() => navigate("/", { replace: true })} style={buttonStyle}>Go Home</button>
        </div>
    );
};

export default TestSelector;
