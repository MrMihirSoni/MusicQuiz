import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [answerIndex, setAnswerIndex] = useState(null);
    const [note, setNote] = useState('');
    const [category, setCategory] = useState('dance');
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => setOptions([...options, '']);

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
        if (trimmedOptions.length < 2) {
            return setMessage('❌ At least 2 valid options are required.');
        }
        if (answerIndex === null || answerIndex >= trimmedOptions.length) {
            return setMessage('❌ Please select the correct answer.');
        }

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
            setTimeout(() => {
                setMessage('');
            }, 5000);
            setQuestion('');
            setOptions(['']);
            setAnswerIndex(null);
            setNote('');
            setUploading(false);
        } catch (err) {
            console.error(err);
            setMessage('❌ Failed to add question.');
            setTimeout(() => {
                setMessage('');
            }, 5000);
            setUploading("false");
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
                    <button type="button" onClick={addOption} style={{ marginBottom: '1rem', padding: "0.5rem", border: "none", background: "rgba(0, 120, 255, 0.2)" }}>➕ Add Option</button>
                )}

                <input
                    placeholder="Note (optional)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: "0.5rem" }}
                />

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ background: category === "music" && "rgba(0, 120, 255, 0.2)", padding: "0.5rem" }}>
                        <input
                            type="radio"
                            value="music"
                            checked={category === 'music'}
                            onChange={e => setCategory(e.target.value)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Music
                    </label>
                    <label style={{ background: category === "dance" && "rgba(0, 120, 255, 0.2)", padding: "0.5rem" }}>
                        <input
                            type="radio"
                            value="dance"
                            checked={category === 'dance'}
                            onChange={e => setCategory(e.target.value)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        Dance
                    </label>
                </div>

                {
                    uploading ? <button style={{ background: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1.5rem" }}>Uploading...</button>
                       : <button style={{ background: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1.5rem" }} type="submit">Submit Question</button>}
            </form>

            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "right" }}><button style={{ background: "rgba(0, 120, 255, 0.2)", border: "none", padding: "10px 1.5rem" }} onClick={() => navigate("/")}>Go Home</button></div>
        </div>
    );
};

export default AddQuestion;
