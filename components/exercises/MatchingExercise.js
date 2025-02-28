import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MatchingExercise = ({ questions }) => {
    const [selectedStart, setSelectedStart] = useState(null);
    const [matches, setMatches] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleMatch = (start, end) => {
        if (isSubmitted) return; // Prevent changes after submission
        
        if (selectedStart === start) {
            setSelectedStart(null);
        } else if (selectedStart === null) {
            setSelectedStart(start);
        } else {
            // Make the match with feedback animation
            setMatches(prev => ({
                ...prev,
                [selectedStart]: end,
                [start]: matches[selectedStart]
            }));
            
            // Show quick feedback animation
            setFeedback({ type: 'match', message: 'Matched!' });
            setTimeout(() => setFeedback(null), 1000);
            
            setSelectedStart(null);
        }
    };

    const handleSubmit = () => {
        const allCorrect = questions.every(q => matches[q.start] === q.end);
        setFeedback({
            type: allCorrect ? 'success' : 'error',
            message: allCorrect ? 'Perfect! All matches are correct!' : 'Some matches are incorrect. Try again!'
        });
        setIsSubmitted(allCorrect);
    };

    const resetExercise = () => {
        setMatches({});
        setSelectedStart(null);
        setFeedback(null);
        setIsSubmitted(false);
    };

    return (
        <motion.div 
            className="matching-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h3>Match the following</h3>
            
            <div className="matching-pairs">
                {questions.map((q, index) => (
                    <motion.div 
                        key={index} 
                        className="matching-pair"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <button
                            className={`match-button 
                                ${selectedStart === q.start ? 'selected' : ''} 
                                ${matches[q.start] ? 'matched' : ''}
                                ${isSubmitted && matches[q.start] !== q.end ? 'incorrect' : ''}`}
                            onClick={() => handleMatch(q.start, q.end)}
                            disabled={isSubmitted}
                        >
                            {q.start}
                        </button>
                        
                        <motion.div 
                            className={`matching-line ${matches[q.start] === q.end ? 'correct' : ''}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: matches[q.start] ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        
                        <button
                            className={`match-button 
                                ${matches[q.start] === q.end ? 'matched' : ''}
                                ${isSubmitted && matches[q.start] !== q.end ? 'incorrect' : ''}`}
                            onClick={() => handleMatch(q.start, q.end)}
                            disabled={isSubmitted}
                        >
                            {q.end}
                        </button>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div 
                        className={`feedback ${feedback.type}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="exercise-controls">
                {!isSubmitted ? (
                    <button 
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={Object.keys(matches).length !== questions.length}
                    >
                        Submit
                    </button>
                ) : (
                    <button 
                        className="reset-btn"
                        onClick={resetExercise}
                    >
                        Try Again
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default MatchingExercise; 