import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { SectionContext } from '../context/SectionContext';

const Glossary = () => {
    const { currentSection, sections } = useContext(SectionContext);
    const glossaryTerms = sections[currentSection].glossary;
    const [selectedWord, setSelectedWord] = useState(null);
    
    const playPronunciation = async (word) => {
        try {
            const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_GOOGLE_API_KEY}`
                },
                body: JSON.stringify({
                    input: { text: word },
                    voice: { languageCode: 'en-US', name: 'en-US-Standard-C' },
                    audioConfig: { audioEncoding: 'MP3' }
                })
            });

            const { audioContent } = await response.json();
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            await audio.play();
        } catch (error) {
            console.error("Error playing pronunciation:", error);
        }
    };

    const WordCard = ({ term }) => (
        <motion.div 
            className="word-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="word-header">
                <h3>{term.word}</h3>
                <button 
                    className="pronunciation-btn"
                    onClick={() => playPronunciation(term.word)}
                >
                    🔊 Listen
                </button>
            </div>
            
            <div className="pronunciation">/{term.pronunciation}/</div>
            
            <div className="meaning">
                {term.meaning}
            </div>
            
            <div className="examples">
                <h4>Examples:</h4>
                <ul>
                    {term.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                    ))}
                </ul>
            </div>

            <motion.div 
                className="word-animation"
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {term.word}
            </motion.div>
        </motion.div>
    );

    return (
        <motion.div 
            className="glossary-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glossary-title"
            >
                Glossary
            </motion.h2>

            <div className="word-list">
                {Object.keys(glossaryTerms).map((word) => (
                    <motion.button
                        key={word}
                        className={`word-button ${selectedWord === word ? 'active' : ''}`}
                        onClick={() => setSelectedWord(word === selectedWord ? null : word)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {glossaryTerms[word].word}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {selectedWord && (
                    <WordCard term={glossaryTerms[selectedWord]} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Glossary; 