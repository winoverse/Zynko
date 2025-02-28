import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Listening({ data }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

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

    return React.createElement(
        motion.div,
        {
            className: 'listening-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        React.createElement('h2', { key: 'title' }, data.title),
        React.createElement('div', { className: 'controls' },
            React.createElement('button', {
                onClick: isPlaying ? stopNews : playNews,
                className: isPlaying ? 'stop-btn' : 'play-btn'
            }, isPlaying ? '⏹️ Stop' : '▶️ Play News')
        ),
        React.createElement('div', { className: 'questions' },
            data.questions.map((q, index) => (
                React.createElement('div', { key: index, className: 'question' },
                    React.createElement('p', { key: 'question' }, q.question),
                    React.createElement('div', { className: 'options' },
                        q.options.map((option, optIndex) => (
                            React.createElement('button', {
                                key: optIndex,
                                className: `option ${selectedAnswers[index] === option ? 'selected' : ''}`,
                                onClick: () => setSelectedAnswers({
                                    ...selectedAnswers,
                                    [index]: option
                                })
                            }, option)
                        ))
                    )
                )
            ))
        )
    );
}

window.Listening = Listening; 
