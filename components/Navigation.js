import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SectionContext } from '../context/SectionContext';

const Navigation = () => {
    const { currentSection, sections, progress, nextSection, previousSection } = useContext(SectionContext);

    const calculateProgress = (sectionId) => {
        const section = progress[sectionId];
        return section.completed ? 100 : 0;
    };

    return (
        <motion.nav 
            className="navigation"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="nav-content">
                <button 
                    className="nav-button prev"
                    onClick={previousSection}
                    disabled={currentSection === 1}
                >
                    ← Previous
                </button>

                <div className="section-indicators">
                    {Object.keys(sections).map((sectionId) => (
                        <div key={sectionId} className="section-indicator">
                            <div className="section-title">
                                {sections[sectionId].title}
                            </div>
                            <motion.div className="progress-bar">
                                <motion.div 
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${calculateProgress(sectionId)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </motion.div>
                            <div className="section-number">
                                {parseInt(sectionId) === currentSection && (
                                    <motion.div
                                        className="current-marker"
                                        layoutId="current"
                                    />
                                )}
                                {sectionId}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    className="nav-button next"
                    onClick={nextSection}
                    disabled={currentSection === Object.keys(sections).length}
                >
                    Next →
                </button>
            </div>
        </motion.nav>
    );
};

export default Navigation; 