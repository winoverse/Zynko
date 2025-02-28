import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContext } from '../context/SectionContext';
import InteractiveProse from './InteractiveProse';
import Quiz from './Quiz';
import Glossary from './Glossary';
import DidYouKnow from './DidYouKnow';

const SectionContent = ({ contentType, contentTitle }) => {
    const { currentSection } = useContext(SectionContext);

    const pageTransition = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration: 0.5 }
    };

    // Render content based on type
    const renderContent = () => {
        switch(contentType) {
            case 'Prose':
                return <InteractiveProse />;
            case 'Quiz':
                return <Quiz />;
            case 'Glossary':
                return <Glossary />;
            case 'Did You Know':
                return <DidYouKnow />;
            default:
                return <InteractiveProse />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={currentSection}
                className="section-content"
                {...pageTransition}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    );
};

export default SectionContent; 