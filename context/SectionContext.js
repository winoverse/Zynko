import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContext } from '../context/SectionContext';
import InteractiveProse from './InteractiveProse';
import Quiz from './Quiz';
import Glossary from './Glossary';
import DidYouKnow from './DidYouKnow';
import Loading from './Loading';

function SectionContent({ contentType, contentTitle }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const { currentSection } = React.useContext(window.SectionContext.SectionContext);

    React.useEffect(() => {
        // Simulate content loading
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    }, [contentType, currentSection]);

    if (isLoading) {
        return React.createElement(Loading);
    }

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
}

window.SectionContent = SectionContent; 
