function SectionContent({ contentType, contentTitle }) {
    console.log('SectionContent rendering:', { contentType, contentTitle });
    
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
        console.log('Rendering loading state');
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
}

window.SectionContent = SectionContent; 
