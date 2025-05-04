import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [answerIndex, setAnswerIndex] = useState(null);
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [justAddedIndex, setJustAddedIndex] = useState(null); // ✅ for focusing last

    const optionRefs = useRef([]);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => {
        setOptions(prev => [...prev, '']);
        setJustAddedIndex(options.length); // next index to focus
    };

    const removeOption = (index) => {
        if (options.length > 1) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
            if (answerIndex === index) setAnswerIndex(null);
            else if (answerIndex > index) setAnswerIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (justAddedIndex !== null && optionRefs.current[justAddedIndex]) {
            optionRefs.current[justAddedIndex].focus();
            setJustAddedIndex(null);
        }
    }, [options]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedOptions = options.map(opt => opt.trim()).filter(opt => opt !== '');
        if (trimmedOptions.length < 2) return setMessage('❌ At least 2 valid options are required.');
        if (answerIndex === null || answerIndex >= trimmedOptions.length) return setMessage('❌ Please select the correct answer.');

        try {
            setUploading(true);
            const payload = {
                question: question.trim(),
                options: trimmedOptions,
                answer: answerIndex,
                note: note.trim() || "No note provided.",
                category
            };
            await axios.post(`https://music-quiz-backend.vercel.app/quiz/addQuestion`, payload);
            setMessage('✅ Question added!');
            setTimeout(() => setMessage(''), 5000);
            setQuestion('');
            setOptions(['']);
            setAnswerIndex(null);
            setNote('');
            setUploading(false);
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to add question.');
            setTimeout(() => setMessage(''), 5000);
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
            <h2 style={{ margin: "1rem 0", color: "#666" }}>Add New Question</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Enter question"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: "0.5rem" }}
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
                            ref={el => optionRefs.current[index] = el} // ✅ store each input ref
                            placeholder={`Option ${index + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(index, e.target.value)}
                            required
                            style={{ flex: 1, marginRight: '0.5rem', padding: "0.5rem", width: "100%" }}
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
                    placeholder="Note (optional)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: "0.5rem" }}
                />

                {/* Category Radio Buttons */}
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

                {uploading ? (
                    <button disabled style={buttonStyle}>Uploading...</button>
                ) : category ? (
                    <button type="submit" style={buttonStyle}>Submit Question</button>
                ) : (
                    <button disabled style={{ ...buttonStyle, background: "rgba(63, 72, 84, 0.2)", color: "#888" }}>Submit Question</button>
                )}
            </form>

            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "right" }}>
                <button onClick={() => navigate("/", {replace: true})} style={buttonStyle}>Go Home</button>
            </div>
        </div>
    );
};

const buttonStyle = {
    background: "rgba(0, 120, 255, 0.2)",
    border: "none",
    padding: "10px 1.5rem"
};

export default AddQuestion;
