function InteractiveProse() {
    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const proseData = sections[currentSection].prose;

    return React.createElement(
        window.motion.div,
        {
            className: 'prose-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        [
            React.createElement('h2', { key: 'title' }, proseData.title),
            React.createElement('div', { 
                key: 'content',
                className: 'prose-content',
                dangerouslySetInnerHTML: { __html: proseData.content }
            })
        ]
    );
}

// Replace export with window assignment
window.InteractiveProse = InteractiveProse; 
