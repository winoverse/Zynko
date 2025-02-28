import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';
import Tooltip from '@mui/material/Tooltip';
import { SectionContext } from '../context/SectionContext';

const InteractiveProse = () => {
    const { currentSection, sections } = useContext(SectionContext);
    const sectionData = sections[currentSection].prose;
    const [speaking, setSpeaking] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    
    // Glossary definitions
    const glossary = {
        marine: {
            meaning: "found in the sea",
            examples: ["Marine animals live in salt water.", "The marine ecosystem is vast and diverse."],
            pronunciation: "mə-ˈrēn"
        },
        species: {
            meaning: "group of animals with common features",
            examples: ["There are many species of birds.", "Each species has unique characteristics."],
            pronunciation: "ˈspē-ˌsēz"
        },
        coastal: {
            meaning: "land by the edge of a sea",
            examples: ["Coastal areas often have beautiful beaches.", "Many people live in coastal regions."],
            pronunciation: "ˈkō-stəl"
        }
    };

    // Text-to-Speech function
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            setSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setSpeaking(false);
            speechSynthesis.speak(utterance);
        }
    };

    // Handle word click
    const handleWordClick = (word) => {
        if (glossary[word.toLowerCase()]) {
            setCurrentWord(word.toLowerCase());
        }
    };

    // Format text with interactive words
    const formatText = (text) => {
        return text.split(' ').map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
            if (glossary[cleanWord]) {
                return (
                    <Tooltip 
                        key={index}
                        title={
                            <div className="glossary-tooltip">
                                <h4>{word}</h4>
                                <p>{glossary[cleanWord].meaning}</p>
                                <small>Pronunciation: {glossary[cleanWord].pronunciation}</small>
                                <button onClick={() => speak(word)}>
                                    🔊 Listen
                                </button>
                            </div>
                        }
                    >
                        <motion.span 
                            className="interactive-word"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleWordClick(cleanWord)}
                        >
                            {word}{' '}
                        </motion.span>
                    </Tooltip>
                );
            }
            return word + ' ';
        });
    };

    return (
        <motion.div 
            className="interactive-prose"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2>{sectionData.title}</motion.h2>
            <div className="controls">
                <button 
                    onClick={() => speak(sectionData.content)}
                    disabled={speaking}
                >
                    {speaking ? '🔊 Reading...' : '🔊 Read Aloud'}
                </button>
            </div>

            <motion.div 
                className="prose-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {formatText(sectionData.content)}
            </motion.div>

            <div className="turtle-images">
                {turtleSpecies.map((turtle, index) => (
                    <motion.div
                        key={index}
                        className="turtle-card"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img src={turtle.image} alt={turtle.name} />
                        <h3>{turtle.name}</h3>
                        <p>{turtle.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Content data
const turtleSpecies = [
    {
        name: "Olive Ridley",
        image: "/img/olive-ridley.jpg",
        description: "Weighs up to 35 kg when fully grown"
    },
    // Add other species...
];

export default InteractiveProse; 