import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SeaWordsExercise = ({ data }) => {
    const [words, setWords] = useState(['', '', '', '', '']);
    const [sentences, setSentences] = useState(['', '', '', '', '']);
    const [feedback, setFeedback] = useState(null);
    const [saved, setSaved] = useState(false);

    const handleWordChange = (index, value) => {
        const newWords = [...words];
        newWords[index] = value;
        setWords(newWords);
        setSaved(false);
    };

    const handleSentenceChange = (index, value) => {
        const newSentences = [...sentences];
        newSentences[index] = value;
        setSentences(newSentences);
        setSaved(false);
    };

    const validateEntry = () => {
        // Check if all filled entries have both word and sentence
        const filledEntries = words.map((word, i) => ({
            word,
            sentence: sentences[i]
        })).filter(entry => entry.word || entry.sentence);

        const isValid = filledEntries.every(entry => 
            entry.word.trim() && 
            entry.sentence.trim() &&
            entry.sentence.toLowerCase().includes(entry.word.toLowerCase())
        );

        return {
            isValid,
            filledCount: filledEntries.length
        };
    };

    const handleSave = () => {
        const { isValid, filledCount } = validateEntry();
        
        if (filledCount === 0) {
            setFeedback({
                type: 'error',
                message: 'Please enter at least one word and sentence.'
            });
            return;
        }

        if (!isValid) {
            setFeedback({
                type: 'error',
                message: 'Make sure each sentence uses its corresponding word.'
            });
            return;
        }

        setSaved(true);
        setFeedback({
            type: 'success',
            message: `Saved ${filledCount} word${filledCount > 1 ? 's' : ''} and sentence${filledCount > 1 ? 's' : ''}!`
        });

        // Here you could also save to a database or context
    };

    return (
        <motion.div 
            className="sea-words-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h3>Sea-Related Words</h3>
            <p className="instruction">{data.instruction}</p>
            
            <div className="example">
                <strong>Example:</strong> {data.example.word} – {data.example.sentence}
            </div>

            <div className="word-entries">
                {words.map((word, index) => (
                    <motion.div 
                        key={index}
                        className="word-entry"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="word-input">
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => handleWordChange(index, e.target.value)}
                                placeholder="Enter sea-related word"
                                className={saved ? 'saved' : ''}
                            />
                        </div>
                        <div className="sentence-input">
                            <input
                                type="text"
                                value={sentences[index]}
                                onChange={(e) => handleSentenceChange(index, e.target.value)}
                                placeholder="Write a sentence using this word"
                                className={saved ? 'saved' : ''}
                            />
                        </div>
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
                <button 
                    className="save-btn"
                    onClick={handleSave}
                    disabled={!words.some(w => w.trim()) || !sentences.some(s => s.trim())}
                >
                    {saved ? 'Update' : 'Save'}
                </button>
            </div>
        </motion.div>
    );
};

export default SeaWordsExercise; 