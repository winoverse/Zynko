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
            
            setTimeout(() => {
                setIsLoading(false);
                console.log('Loading complete');
            }, 1000);
        }, [contentType, currentSection]);

        if (isLoading) {
            console.log('Returning Loading component');
            return React.createElement(window.Loading);
        }

        return React.createElement(
            window.motion.div,
            {
                className: 'section-content',
                initial: { opacity: 0 },
                animate: { opacity: 1 }
            },
            React.createElement(window.InteractiveProse)
        );
    } catch (error) {
        console.error('Error in SectionContent:', error);
        return React.createElement('div', null, 'Error loading content');
    }
}

window.SectionContent = SectionContent;
console.log('SectionContent registered'); 
