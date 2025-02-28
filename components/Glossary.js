import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '@mui/material/Tooltip';
import { SectionContext } from '../context/SectionContext';

function Glossary() {
    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const glossaryData = sections[currentSection].glossary;
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredWords = Object.values(glossaryData).filter(word =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return React.createElement(
        motion.div,
        {
            className: 'glossary-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 }
        },
        React.createElement(
            'div',
            { className: 'search-container' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search words...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: 'search-input'
            })
        ),
        React.createElement(
            'div',
            { className: 'word-list' },
            filteredWords.map((word, index) =>
                React.createElement(
                    motion.div,
                    {
                        key: word.word,
                        className: 'word-card',
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: index * 0.1 }
                    },
                    React.createElement('h3', null, word.word),
                    React.createElement('p', { className: 'meaning' }, word.meaning),
                    React.createElement('p', { className: 'pronunciation' }, `Pronunciation: ${word.pronunciation}`),
                    React.createElement(
                        'div',
                        { className: 'examples' },
                        React.createElement('h4', null, 'Examples:'),
                        React.createElement(
                            'ul',
                            null,
                            word.examples.map((example, i) =>
                                React.createElement('li', { key: i }, example)
                            )
                        )
                    )
                )
            )
        )
    );
}

window.Glossary = Glossary; 
