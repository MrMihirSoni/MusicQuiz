import React, { useState, useEffect, useRef } from 'react';
import { replace, useAsyncError, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateQuestion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const questionData = location.state?.questionData;
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [answerIndex, setAnswerIndex] = useState(null);
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [updating, setUpdating] = useState(false);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const optionRefs = useRef([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (questionData) {
            setQuestion(questionData.question);
            setOptions(questionData.options);
            setAnswerIndex(questionData.answer);
            setNote(questionData.note || '');
            setCategory(questionData.category || '');
        }
    }, [questionData]);

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => {
        if (options.length < 5) setOptions(prev => [...prev, '']);
    };

    const removeOption = (index) => {
        if (options.length > 1) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
            if (answerIndex === index) setAnswerIndex(null);
            else if (answerIndex > index) setAnswerIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== '');
        if (trimmedOptions.length < 2) return setMessage('❌ At least 2 valid options required.');
        if (answerIndex === null || answerIndex >= trimmedOptions.length) return setMessage('❌ Select correct answer.');

        console.log(questionData)

        try {
            setUpdating(true);
            const payload = {
                _id: questionData._id, // Assuming _id is available
                question: question.trim(),
                options: trimmedOptions,
                answer: answerIndex,
                note: note.trim() || "No note provided.",
                category
            };

            await axios.patch(`https://music-quiz-backend.vercel.app/quiz/updateQuestion`, payload);
            setMessage('✅ Question updated!');
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to update question.');
        } finally {
            setUpdating(false);
        }
    };


    return (
        <>
                <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
                    <h2 style={{ margin: "1rem 0", color: "#666" }}>Update Question</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            required
                            placeholder="Enter question"
                            style={{ width: "100%", marginBottom: '1rem', padding: "0.5rem" }}
                        />

                        {options.map((opt, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={answerIndex === index}
                                    onChange={() => setAnswerIndex(index)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <input
                                    ref={el => optionRefs.current[index] = el}
                                    placeholder={`Option ${index + 1}`}
                                    value={opt}
                                    onChange={e => handleOptionChange(index, e.target.value)}
                                    required
                                    style={{ flex: 1, marginRight: '0.5rem', padding: "0.5rem" }}
                                />
                                {options.length > 1 && (
                                    <button type="button" onClick={() => removeOption(index)}>❌</button>
                                )}
                            </div>
                        ))}

                        {options.length < 5 && (
                            <button type="button" onClick={addOption} style={{ marginBottom: '1rem', padding: "0.5rem", border: "none", background: "rgba(0, 120, 255, 0.2)" }}>
                                ➕ Add Option
                            </button>
                        )}

                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Note (optional)"
                            style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: "0.5rem" }}
                        />

                        <div style={{ marginBottom: '1rem' }}>
                            {["music", "dance", "tabla"].map(cat => (
                                <label key={cat} style={{
                                    background: category === cat ? "rgba(0, 120, 255, 0.2)" : "",
                                    padding: "0.5rem", marginRight: "1rem"
                                }}>
                                    <input
                                        type="radio"
                                        value={cat}
                                        checked={category === cat}
                                        onChange={e => setCategory(e.target.value)}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </label>
                            ))}
                        </div>

                        <button type="submit" style={buttonStyle} disabled={updating}>
                            {updating ? 'Updating...' : 'Update Question'}
                        </button>
                    </form>

                    {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

                    <button onClick={() => navigate("/", { replace: true })} style={{ ...buttonStyle, marginTop: "1rem" }} >Go Home</button>
                </div>
                
        </>
    );
};

const buttonStyle = {
    background: "rgba(0, 120, 255, 0.2)",
    border: "none",
    padding: "10px 1.5rem"
};

export default UpdateQuestion;
