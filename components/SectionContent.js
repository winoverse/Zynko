function SectionContent({ contentType, contentTitle }) {
    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Add console log for debugging
        console.log('SectionContent mounted', { contentType, currentSection });
        
        // Simulate content loading
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Content loaded');
        }, 1000);
    }, [contentType, currentSection]);

    if (isLoading) {
        return React.createElement(window.Loading);
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
}

window.SectionContent = SectionContent; 
