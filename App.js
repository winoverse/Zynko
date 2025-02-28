function App({ unit, contentType, contentTitle }) {
    return React.createElement(
        window.SectionContext.SectionProvider,
        { initialSection: unit || '1' },
        React.createElement(window.SectionContent, {
            contentType: contentType || 'Prose',
            contentTitle: contentTitle || 'Introduction'
        })
    );
}

window.App = App; 
