const { SectionProvider } = window.SectionContext;

function App({ unit, contentType, contentTitle }) {
    return React.createElement(
        SectionProvider,
        { initialSection: unit },
        React.createElement(Navigation, null),
        React.createElement(
            'div',
            { className: 'content-wrapper' },
            React.createElement(SectionContent, {
                contentType: contentType,
                contentTitle: contentTitle
            })
        )
    );
}

window.App = App; 
