import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Listening = ({ data }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const playNews = () => {
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(data.newsContent);
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
    };

    const stopNews = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <motion.div 
            className="listening-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>{data.title}</h2>
            
            <div className="controls">
                <button 
                    onClick={isPlaying ? stopNews : playNews}
                    className={isPlaying ? 'stop-btn' : 'play-btn'}
                >
                    {isPlaying ? '⏹️ Stop' : '▶️ Play News'}
                </button>
            </div>

            <div className="questions">
                {data.questions.map((q, index) => (
                    <div key={index} className="question">
                        <p>{q.question}</p>
                        <div className="options">
                            {q.options.map((option, optIndex) => (
                                <button
                                    key={optIndex}
                                    className={`option ${selectedAnswers[index] === option ? 'selected' : ''}`}
                                    onClick={() => setSelectedAnswers({
                                        ...selectedAnswers,
                                        [index]: option
                                    })}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Listening; 