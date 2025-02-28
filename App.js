function App({ unit, contentType, contentTitle }) {
    return React.createElement(
        window.SectionContext.SectionProvider,
        { initialSection: unit },
        [
            React.createElement(window.Navigation, { key: 'nav' }),
            React.createElement(
                'div',
                { key: 'content', className: 'content-wrapper' },
                React.createElement(window.SectionContent, {
                    contentType: contentType,
                    contentTitle: contentTitle
                })
            )
        ]
    );
}

window.App = App; 
