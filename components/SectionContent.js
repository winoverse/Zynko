function SectionContent({ contentType, contentTitle }) {
    try {
        console.log('SectionContent rendering:', { contentType, contentTitle });
        
        if (!window.SectionContext) {
            throw new Error('SectionContext not found');
        }
        
        const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
        console.log('Context values:', { currentSection, sections });
        
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
            console.log('SectionContent effect running');
            setIsLoading(true);
            
            // Verify sections data
            if (!sections || !sections[currentSection]) {
                console.error('Invalid sections data:', { sections, currentSection });
                return;
            }

            setTimeout(() => {
                setIsLoading(false);
                console.log('Loading complete');
            }, 1000);
        }, [contentType, currentSection, sections]);

        if (isLoading) {
            console.log('Returning Loading component');
            return React.createElement(window.Loading);
        }

        console.log('Rendering content:', contentType);

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
                    return React.createElement(window.InteractiveProse);
                case 'Quiz':
                    return React.createElement(window.Quiz);
                case 'Glossary':
                    return React.createElement(window.Glossary);
                case 'Did You Know':
                    return React.createElement(window.DidYouKnow);
                default:
                    return React.createElement(window.InteractiveProse);
            }
        };

        return React.createElement(
            window.motion.div,
            {
                className: 'section-content',
                initial: { opacity: 0 },
                animate: { opacity: 1 }
            },
            renderContent()
        );
    } catch (error) {
        console.error('Error in SectionContent:', error);
        return React.createElement('div', null, 'Error loading content');
    }
}

window.SectionContent = SectionContent; 
